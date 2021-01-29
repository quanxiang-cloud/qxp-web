package log

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"

	"github.com/sirupsen/logrus"
)

type Logger = logrus.FieldLogger

type ErrorHook struct {
	bufferPool *sync.Pool
	levels     []logrus.Level
	Out        io.WriteCloser
	formatter  logrus.Formatter
}

// GetLogger will return a ServerLogger
func GetLogger(logDir, name string) Logger {
	return GetUnbufferedLogger(logDir, name)
}

func SetLoggerLevel(logger Logger, lvl string) {
	level := map[string]logrus.Level{
		"panic": PanicLevel,
		"fatal": FatalLevel,
		"error": ErrorLevel,
		"warn":  WarnLevel,
		"info":  InfoLevel,
		"debug": DebugLevel,
	}
	if l, ok := level[lvl]; ok {
		logger.(*logrus.Logger).Level = l
		return
	}
}

func EnableStdout(logger Logger) {
	logger.(*logrus.Logger).Hooks.Add(getStdoutHook())
}

func NewEntry(logger Logger) Logger {
	logger_, ok := logger.(*logrus.Logger)
	if ok {
		entry := logrus.NewEntry(logger_)
		entry.Level = logger_.Level
		return entry
	}
	return logger
}

// For single-process application
func GetBufferedLogger(logDir string, name string) Logger {
	log_file := filepath.Join(logDir, name+".log")
	err_file := filepath.Join(logDir, name+".logrus.wf")
	output := NewBufLogWriter(log_file, 0644)
	outputErr := NewBufLogWriter(err_file, 0644)
	// Normal log rotate
	signal.Notify(output.ReopenNoti, syscall.SIGUSR1)
	signal.Notify(outputErr.ReopenNoti, syscall.SIGUSR1)
	// When graceful restart, should reopen log file
	formatter := &ClassicFormatter{
		TimestampFormat: defaultTimestampFormat,
		FieldsDelimiter: ", ",
	}
	hook := NewErrorHook(outputErr)
	logger := &logrus.Logger{
		Out:       output,
		Formatter: formatter,
		Hooks:     make(logrus.LevelHooks),
		Level:     logrus.DebugLevel,
	}
	logger.Hooks.Add(hook)
	// Disable locking in logger, since we have locking in BufLogWriter
	logger.SetNoLock()
	return logger
}

// For multi-process application
func GetUnbufferedLogger(logDir string, name string) Logger {
	log_file := filepath.Join(logDir, name+".log")
	err_file := filepath.Join(logDir, name+".log.wf")

	// ensure logDir exist
	if err := os.MkdirAll(logDir, 0755); err != nil {
		panic(err)
	}

	output := NewReopenWriter(log_file, 0644)
	outputErr := NewReopenWriter(err_file, 0644)
	// Normal log rotate
	signal.Notify(output.ReopenNoti, syscall.SIGUSR1)
	signal.Notify(outputErr.ReopenNoti, syscall.SIGUSR1)
	// When graceful restart, should reopen log file
	formatter := &ClassicFormatter{
		TimestampFormat: defaultTimestampFormat,
		FieldsDelimiter: ", ",
	}
	hook := NewErrorHook(outputErr)
	logger := &logrus.Logger{
		Out:       output,
		Formatter: formatter,
		Hooks:     make(logrus.LevelHooks),
		Level:     logrus.DebugLevel,
	}
	logger.Hooks.Add(hook)
	// Disable locking in logger, since we have locking in BufLogWriter
	logger.SetNoLock()
	return logger
}

func (eh *ErrorHook) Levels() []logrus.Level {
	return eh.levels
}

func (eh *ErrorHook) Fire(entry *logrus.Entry) error {
	entry.Buffer = eh.bufferPool.Get().(*bytes.Buffer)
	entry.Buffer.Reset()
	serialized, err := eh.formatter.Format(entry)
	if err == nil {
		eh.Out.Write(serialized)
	}
	eh.bufferPool.Put(entry.Buffer)
	entry.Buffer = nil
	return err
}

func NewErrorHook(out io.WriteCloser) *ErrorHook {
	formatter := &DebugFormatter{
		TimestampFormat: defaultTimestampFormat,
		FieldsDelimiter: ", ",
	}
	return &ErrorHook{
		Out:    out,
		levels: []logrus.Level{logrus.ErrorLevel, logrus.FatalLevel, logrus.PanicLevel},
		bufferPool: &sync.Pool{
			New: func() interface{} {
				return bytes.NewBuffer(make([]byte, 256))
			},
		},
		formatter: formatter,
	}
}

func CloseLogger(logger Logger) {
	_logger := logger.(*logrus.Logger)
	out, _ := _logger.Out.(io.Closer)
	if out == nil {
		return
	}
	err := out.Close()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Close logger error: %v\n", err)
	}
	for _, hooks := range _logger.Hooks {
		if len(hooks) > 0 {
			eh, _ := hooks[0].(*ErrorHook)
			if eh.Out.Close() != nil {
				fmt.Fprintf(os.Stderr, "Close hook error: %v\n", err)
			}
			break
		}
	}
}

func GetScreenLogger() Logger {
	logger := logrus.New()
	logger.Level = logrus.DebugLevel
	logger.Formatter = &ClassicFormatter{
		TimestampFormat: defaultTimestampFormat,
		FieldsDelimiter: ", ",
	}
	return logger
}

type StdoutHook struct {
	logrus.Hook
	formatter logrus.Formatter
}

func (stdoutHook *StdoutHook) Levels() []logrus.Level {
	return []logrus.Level{logrus.DebugLevel, logrus.InfoLevel, logrus.WarnLevel, logrus.ErrorLevel, logrus.FatalLevel, logrus.PanicLevel}
}

func (stdoutHook *StdoutHook) Fire(entry *logrus.Entry) error {
	serialized, err := stdoutHook.formatter.Format(entry)
	if err == nil {
		fmt.Print(string(serialized))
	}
	return err
}

func getStdoutHook() *StdoutHook {
	formatter := &DebugFormatter{
		TimestampFormat: defaultTimestampFormat,
		FieldsDelimiter: ", ",
	}
	return &StdoutHook{
		formatter: formatter,
	}
}
