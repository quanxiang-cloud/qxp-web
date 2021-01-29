package contexts

import (
	"errors"
	"fmt"
	"sync"
	"time"
)

// original from
// https://github.com/Yu-33/snowflake/blob/master/snowflake.go
/*
Signed(0) |     Millisecond Timestamp (41 bits)       | Instance (10 bits) | Sequence (12 bits)
0     | 00000000000000000000000000000000000000000 |     0000000000     |    000000000000
*/

const (
	sequenceBits  uint = 12
	instanceBits  uint = 10
	timestampBits uint = 41

	maxSequenceID = -1 ^ (-1 << sequenceBits)
	maxInstanceID = -1 ^ (-1 << instanceBits)
	maxTimestamp  = -1 ^ (-1 << timestampBits)

	instanceShift  = sequenceBits
	timestampShift = instanceShift + instanceBits

	maxNextIdsNum = 128
)

const (
	originTime int64 = 1547417892000 // The default origin time 2019-01-14 06:18:12
)

// SnowFlake for implements a algorithm of snowflake
type SnowFlake struct {
	mtx            *sync.Mutex
	instanceID     int64
	lastTimestamp  int64
	lastSequenceID int64
}

// NewSnowFlake return a new SnowFlake
func NewSnowFlake(instanceID int64) (*SnowFlake, error) {
	if instanceID < 0 {
		return nil, errors.New("the specified instanceId can't less than 0")
	}
	if instanceID > maxInstanceID {
		return nil, fmt.Errorf("the specified instanceId can't more than %d", maxInstanceID)
	}

	sf := &SnowFlake{
		mtx:            new(sync.Mutex),
		instanceID:     instanceID,
		lastTimestamp:  0,
		lastSequenceID: 0,
	}
	return sf, nil
}

// Decompose decompose id to timestamp instance id and sequence id
func (sf *SnowFlake) Decompose(id int64) (timestamp int64, instanceID int64, sequenceID int64) {
	timestamp = id>>timestampShift + originTime
	instanceID = id >> instanceShift & maxInstanceID
	sequenceID = id & maxSequenceID
	return
}

// NextIds return multiple ids at once
func (sf *SnowFlake) NextIds(num int) ([]int64, error) {
	if num > maxNextIdsNum || num < 0 {
		return nil, fmt.Errorf("invalid num %d", num)
	}

	var err error

	sf.mtx.Lock()
	defer sf.mtx.Unlock()

	ids := make([]int64, num)
	for i := 0; i < num; i++ {
		ids[i], err = sf.nextID()
		if err != nil {
			return nil, err
		}
	}
	return ids, nil
}

// NextID return a new unique id with thread safe
func (sf *SnowFlake) NextID() (int64, error) {
	sf.mtx.Lock()
	defer sf.mtx.Unlock()
	return sf.nextID()
}

// nextID generate a new unique id
func (sf *SnowFlake) nextID() (int64, error) {
	var uniqueID int64
	var timestamp int64

	timestamp = sf.millTimestamp()
	if timestamp < sf.lastTimestamp {
		return 0, errors.New("clock moved backwards")
	}

	for sf.lastSequenceID > maxSequenceID && sf.lastTimestamp == timestamp {
		time.Sleep(time.Millisecond)
		timestamp = sf.millTimestamp()
	}

	if (timestamp - originTime) >= maxTimestamp {
		return 0, errors.New("over the time limit")
	}

	if sf.lastTimestamp == timestamp {
		sf.lastSequenceID++
	} else {
		sf.lastSequenceID = 0
	}

	sf.lastTimestamp = timestamp

	uniqueID = ((timestamp - originTime) << timestampShift) | (sf.instanceID << instanceShift) | sf.lastSequenceID
	return uniqueID, nil
}

// millTimestamp generate a unix millisecond
func (sf *SnowFlake) millTimestamp() int64 {
	return time.Now().UnixNano() / 1e6
}
