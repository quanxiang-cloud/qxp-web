package contexts

import (
	"net"
	"strconv"
	"strings"
)

func getInstanceID() int64 {
	addrs, err := net.InterfaceAddrs()

	if err != nil {
		return 1
	}

	for _, address := range addrs {
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				segments := strings.Split(ipnet.IP.String(), ".")
				instanceID, err := strconv.ParseInt(segments[len(segments)-1], 10, 10)
				if err != nil {
					return 1
				}
				return instanceID
			}
		}
	}

	return 1
}
