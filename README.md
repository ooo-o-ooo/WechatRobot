## 说明
企业自建应用发送消息通知

接口：`/api/message`

发送数据格式
```json
{
    "message" : "这里是消息"
}
   ```
## Vercel变量
```
CORP_ID=企业ID
CORP_SECRET=应用秘钥
AGENT_ID= 应用ID
```

## 其它说明
部署后，post访问一次接口，会返回错误信息，将IP地址添加到企业微信应用的信任IP

部署后不要随便更新Vercel部署，否则服务器IP会改变，需要重新添加IP白名单

