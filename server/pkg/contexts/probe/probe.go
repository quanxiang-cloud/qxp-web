package probe

import (
	"net/http"
	"strings"
	"sync/atomic"
)

const (
	readinessPending int32 = iota
	readinessTrue
	readinessFalse
)

// Probe probe
type Probe struct {
	readiness int32
}

// New return *Probe
func New() *Probe {
	return &Probe{
		readiness: readinessPending,
	}
}

func (p *Probe) setTrue() {
	atomic.StoreInt32(&p.readiness, readinessTrue)
}

func (p *Probe) setFalse() {
	atomic.StoreInt32(&p.readiness, readinessFalse)
}

func (p *Probe) getReadiness() int32 {
	return atomic.LoadInt32(&p.readiness)
}

// SetRunning set running
func (p *Probe) SetRunning() {
	p.setTrue()
}

// LivenessProbe liveness probe
func (p *Probe) LivenessProbe(w http.ResponseWriter, r *http.Request) {
	if p.getReadiness() != readinessFalse {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.WriteHeader(http.StatusBadRequest)
}

func (p *Probe) isSafe(r *http.Request) bool {
	if strings.HasPrefix(r.Host, "127.0.0.1") ||
		strings.HasPrefix(r.Host, "localhost") {
		return true
	}
	return false
}

// ReadinessProbe readiness probe
func (p *Probe) ReadinessProbe(w http.ResponseWriter, r *http.Request) {
	if r.Header.Get("x-readiness-shutdown") != "" {
		if !p.isSafe(r) {
			return
		}
		p.setFalse()
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if p.getReadiness() == readinessTrue {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.WriteHeader(http.StatusBadRequest)
}
