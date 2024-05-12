package middleware

// どうやってアーキテクチャに組み込むか検討中
type msalAuthMiddlewarere interface {
}

/*
func MsalAuthMiddleWare() gin.HandlerFunc {

	return func(c *gin.Context) {
		exist, data, err := getEntraIdInfo.GetSingleRecordData(c)
		getEntraIdInfo.GetInfo(c)
		tokenHeader := c.GetHeader("Authorization")
		// clientID := os.Getenv("CLIENT_ID") 環境変数からではなく、DBから読み取りたい
		if clientID == "" {
			fmt.Println("おいおい")
			c.JSON(http.StatusInternalServerError, gin.H{"message": "unsettled client_id at server"})
			c.Abort()
			return
		}

		tokenStrings := strings.Split(tokenHeader, "Bearer ")
		if len(tokenStrings) < 2 {
			c.JSON(http.StatusBadRequest, gin.H{"message": "invalid authorization header"})
			c.Abort()
			return
		}

		// http client
		client := &http.Client{
			Timeout:   10 * time.Second,
			Transport: http.DefaultTransport,
		}

		// microsoftのopenid構成情報へのリクエスト
		req, err := http.NewRequestWithContext(c, "GET", "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration", nil)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
		resp1, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
		defer resp1.Body.Close()
		if resp1.StatusCode != http.StatusOK {
			c.JSON(resp1.StatusCode, gin.H{"message": "failed to request openid-configuration"})
			c.Abort()
			return
		}

		// openid-configurationのレスポンスからJWKsetのURIを取得
		var generic map[string]interface{}
		if err = json.NewDecoder(resp1.Body).Decode(&generic); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
		jwks_uri, ok := generic["jwks_uri"].(string)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "conversion failed"})
			c.Abort()
			return
		}
		// JWKset
		keySet, err := jwk.Fetch(c, jwks_uri)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
		// 署名確認とか検証
		tok, err := jwt.ParseString(tokenStrings[1], jwt.WithKeySet(keySet, jws.WithInferAlgorithmFromKey(true)), jwt.WithValidate(true), jwt.WithAudience(clientID), jwt.WithContext(c))

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
		_ = tok

		c.Next()
	}
}
*/
