package contexts

import (
	"log"
	"strconv"
)

const webInstanceNumberKey string = "web_instance_number"

func getInstanceID() int64 {
	_, err := Cache.Incr(webInstanceNumberKey).Result()
	if err != nil {
		log.Fatal("failed to perform redis cmd incr", err.Error())
	}

	instanceID, err := strconv.ParseInt(Cache.Get(webInstanceNumberKey).Val(), 10, 10)
	if err != nil {
		return 1
	}

	return instanceID
}
