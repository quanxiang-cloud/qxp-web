package log

import (
	"bytes"
	"fmt"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
)

const defaultTimestampFormat = time.RFC3339

func PrintTimeDefault(buf *bytes.Buffer, t time.Time) {
	var b [20]byte
	buf.Write(t.AppendFormat(b[0:0], defaultTimestampFormat))
}

func PrintTimeCustome(buf *bytes.Buffer, t time.Time, format string) {
	var b [30]byte
	if len(format) < 30 {
		buf.Write(t.AppendFormat(b[0:0], format))
	} else {
		buf.WriteString(t.Format(format))
	}
}

type ClassicFormatter struct {
	TimestampFormat string
	FieldsDelimiter string
	PrintTime       func(*bytes.Buffer, time.Time)
}

func (f *ClassicFormatter) Format(entry *logrus.Entry) ([]byte, error) {
	var b *bytes.Buffer
	if entry.Buffer != nil {
		b = entry.Buffer
	} else {
		b = &bytes.Buffer{}
	}
	// write [%time] [%level] %message
	if f.TimestampFormat == "" {
		f.TimestampFormat = defaultTimestampFormat
	}
	if f.FieldsDelimiter == "" {
		f.FieldsDelimiter = " "
	}
	rId := entry.Data["r_id"]
	if f.PrintTime == nil {
		if f.TimestampFormat == "" || f.TimestampFormat == defaultTimestampFormat {
			f.PrintTime = PrintTimeDefault
		} else {
			f.PrintTime = func(buf *bytes.Buffer, t time.Time) {
				PrintTimeCustome(buf, t, f.TimestampFormat)
			}
		}
	}
	// reduce converting to interface{} from other types in fmt.Fprintf
	b.WriteString("[")
	f.PrintTime(b, entry.Time)
	b.WriteString("] [")
	b.WriteString(entry.Level.String())
	b.WriteString("] ")
	b.WriteString(entry.Message)
	if rId != nil {
		switch rId.(type) {
		case uint64:
			fmt.Fprintf(b, " (%016x)", rId)
		default:
			fmt.Fprintf(b, " (%s)", rId)
		}
	}
	b.WriteByte('\n')
	return b.Bytes(), nil
}

// Print file and line in log
type DebugFormatter struct {
	TimestampFormat string
	FieldsDelimiter string
	PrintTime       func(*bytes.Buffer, time.Time)
}

func (f *DebugFormatter) getCaller() (file string, line int) {
	// XXX: The stack is depending on how you use logrus.
	// It's event different when using logger.Info() or entry.Info()
	for i := 4; i < 10; i++ {
		_, file, line, _ = runtime.Caller(i)
		if !strings.Contains(file, "logrus/") {
			file = filepath.Base(file)
			return
		}
	}
	return
}

func (f *DebugFormatter) Format(entry *logrus.Entry) ([]byte, error) {
	var b *bytes.Buffer
	var file string
	var line int
	if entry.Buffer != nil {
		b = entry.Buffer
	} else {
		b = &bytes.Buffer{}
	}
	// write [%time] [%level] %message
	if f.TimestampFormat == "" {
		f.TimestampFormat = defaultTimestampFormat
	}
	if f.FieldsDelimiter == "" {
		f.FieldsDelimiter = " "
	}
	rId := entry.Data["r_id"]
	file, line = f.getCaller()
	if f.PrintTime == nil {
		if f.TimestampFormat == "" || f.TimestampFormat == defaultTimestampFormat {
			f.PrintTime = PrintTimeDefault
		} else {
			f.PrintTime = func(buf *bytes.Buffer, t time.Time) {
				PrintTimeCustome(buf, t, f.TimestampFormat)
			}
		}
	}
	b.WriteString("[")
	f.PrintTime(b, entry.Time)
	b.WriteString("] [")
	b.WriteString(entry.Level.String())
	b.WriteString("] ")
	b.WriteString(entry.Message)
	b.WriteString(" [")
	b.WriteString(file)
	fmt.Fprintf(b, ":%d]", line)
	if rId != nil {
		switch rId.(type) {
		case uint64:
			fmt.Fprintf(b, " (%016x)", rId)
		default:
			fmt.Fprintf(b, " (%s)", rId)
		}
	}
	b.WriteByte('\n')
	return b.Bytes(), nil
}
