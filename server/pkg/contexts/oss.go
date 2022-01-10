package contexts

import (
	"encoding/json"

	"github.com/tidwall/gjson"
)

func getOSSConfig() OSSConfig {
	ossConfig := OSSConfig{
		Domain:         "",
		PrivateBucket:  "",
		ReadableBucket: "",
	}

	body, err := SendRequest(Ctx, "POST", "/api/v1/fileserver1/domain", []byte("{}"), map[string]string{
		"Content-Type": "application/json",
	})

	if err != "" {
		Logger.Errorln("failed to get oss_config, err:", err)
		return ossConfig
	}

	data := gjson.Get(string(body), "data").Raw
	if err := json.Unmarshal([]byte(data), &ossConfig); err != nil {
		Logger.Errorln("failed to unmarshall oss config err: ", err)
	}

	return ossConfig
}
