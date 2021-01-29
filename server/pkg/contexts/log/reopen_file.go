package log

/*

Reimplement based on "github.com/client9/reopen"

*/

import (
	"bufio"
	"fmt"
	"os"
	"sync"
	"sync/atomic"
	"time"
	"unsafe"
)

const bufferFileSize = 256 * 1024
const flushInterval = 30 * time.Second

// Log writer with buffer, suitable for single process application
type BufLogWriter struct {
	sync.Mutex
	writer     *bufio.Writer
	filePath   string
	f          *os.File
	mode       os.FileMode
	ReopenNoti chan os.Signal
	closeNoti  chan bool
}

func NewBufLogWriter(filePath string, mode os.FileMode) *BufLogWriter {
	blw := &BufLogWriter{
		filePath: filePath,
		mode:     mode,
		// Channel size is the number of signal to work with.
		// We assume only one
		ReopenNoti: make(chan os.Signal, 1),
		closeNoti:  make(chan bool, 1),
	}
	if err := blw.open(); err != nil {
		panic(err)
	}
	go blw.flushDaemon()
	return blw
}

func (blw *BufLogWriter) GetReopenChannel() chan os.Signal {
	return blw.ReopenNoti
}

func (blw *BufLogWriter) open() error {
	f, err := os.OpenFile(blw.filePath, os.O_WRONLY|os.O_APPEND|os.O_CREATE,
		blw.mode)
	if err != nil {
		return err
	}
	blw.f = f
	blw.writer = bufio.NewWriterSize(f, bufferFileSize)
	return nil
}

func (blw *BufLogWriter) Write(p []byte) (int, error) {
	blw.Lock()
	n, err := blw.writer.Write(p)
	// Special Case... if the used space in the buffer is LESS than
	// the input, then we did a flush in the middle of the line
	// and the full log line was not sent on its way.
	if blw.writer.Buffered() < len(p) {
		blw.writer.Flush()
	}
	blw.Unlock()
	return n, err
}

func (blw *BufLogWriter) flush() error {
	if blw.writer != nil {
		return blw.writer.Flush()
	}
	return nil
}

func (blw *BufLogWriter) Close() (err error) {
	close(blw.closeNoti)
	blw.Lock()
	defer blw.Unlock()
	err = blw.flush()
	if err == nil {
		err = blw.f.Sync()
	}
	blw.f.Close()
	blw.f = nil
	blw.writer = nil
	return
}

func (blw *BufLogWriter) Reopen() error {
	var err error
	blw.Lock()
	blw.flush()
	blw.f.Close()
	blw.f = nil
	blw.writer = nil
	err = blw.open()
	blw.Unlock()
	return err
}

// flushDaemon periodically flushes the log file buffers.
// props to glog
func (blw *BufLogWriter) flushDaemon() {
	var err error
	for {
		select {
		case <-blw.closeNoti:
			break
		case <-blw.ReopenNoti:
			if err = blw.Reopen(); err != nil {
				fmt.Fprintf(os.Stderr, "Reopen error: %v", err)
			}
		case <-time.After(flushInterval):
			blw.Lock()
			blw.flush()
			blw.Unlock()
		}
	}
}

// Log writer without buffer, suitable for multi-process application
type ReopenWriter struct {
	filePath   string
	p          unsafe.Pointer
	f          *os.File
	mode       os.FileMode
	ReopenNoti chan os.Signal
	closeNoti  chan bool
}

// todo mkdir dir
func NewReopenWriter(filePath string, mode os.FileMode) *ReopenWriter {
	w := &ReopenWriter{
		filePath:   filePath,
		mode:       mode,
		ReopenNoti: make(chan os.Signal, 1),
		closeNoti:  make(chan bool, 1),
	}
	if err := w.open(); err != nil {
		panic(err)
	}
	go w.watcher()
	return w
}

func (w *ReopenWriter) GetReopenChannel() chan os.Signal {
	return w.ReopenNoti
}

func (w *ReopenWriter) open() error {
	f, err := os.OpenFile(w.filePath,
		os.O_WRONLY|os.O_APPEND|os.O_CREATE,
		w.mode,
	)
	if err != nil {
		return err
	}
	w.f = f
	atomic.StorePointer(&w.p, unsafe.Pointer(w.f))
	return nil
}

func (w *ReopenWriter) Write(buf []byte) (int, error) {
	p := atomic.LoadPointer(&w.p)
	if p == nil {
		return 0, os.ErrInvalid
	}
	f := (*os.File)(p)
	n, err := f.Write(buf)
	return n, err
}

func (w *ReopenWriter) Reopen() (err error) {
	old_f := w.f
	for {
		err := w.open()
		if err == nil {
			break
		}
		println("Reopen error: %v", err)
		time.Sleep(time.Second)
	}
	go func() {
		// Close old file 10 minute later
		time.Sleep(time.Second * 10)
		if old_f != nil {
			old_f.Close()
		}
	}()
	return
}

func (w *ReopenWriter) watcher() {
	for {
		select {
		case <-w.closeNoti:
			break
		case <-w.ReopenNoti:
			w.Reopen()
		case <-time.After(time.Second):
		}
	}
}

func (w *ReopenWriter) Close() (err error) {
	close(w.closeNoti)
	w.f.Close()
	w.f = nil
	w.p = nil
	return
}
