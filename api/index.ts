
const express = require('express');
const path = require('path');
const axios = require('axios');
let returnStatus = '';
const CORP_ID = process.env.CORP_ID;
const CORP_SECRET = process.env.CORP_SECRET;
const AGENT_ID =  process.env.AGENT_ID;
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});
app.get("/api/app", (req, res) => {
    res.send("Express on Vercel");
});


app.post('/api/message', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).send('缺少 message 字段');
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
        return res.status(500).send('无法获取 access_token');
    }

    await sendMessage(accessToken, message);
    res.send(returnStatus);
});


/**
 * 获取企业微信 access_token
 *
 * @returns 返回获取到的 access_token，若获取失败则返回 null
 */
async function getAccessToken() {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${CORP_ID}&corpsecret=${CORP_SECRET}`;
    try {
        const response = await axios.get(url);
        return response.data.access_token;
    } catch (error) {
        console.error('获取 access_token 出错:', error);
        return null;
    }
}

/**
 * 发送消息
 *
 * @param accessToken 访问令牌
 * @param message 消息内容
 * @returns Promise<void> 无返回值，但会在控制台输出消息发送结果
 */
async function sendMessage(accessToken, message) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`;
    const data = {
        "touser": "@all", // 发送给所有人，也可以指定用户ID列表
        "msgtype": "text",
        "agentid": AGENT_ID,
        "text": {
            "content": message
        }
    };

    try {
        const response = await axios.post(url, data);
        console.log('消息发送成功:', response.data);
        console.log('消息发送成功:', returnStatus);
        returnStatus = '{errorcode:' + response.data.errcode + ',errmsg:' + response.data.errmsg + '}';
    } catch (error) {
        console.error('消息发送出错:', error);
        returnStatus = String(error);

    }
}



app.listen(3000, () => console.log('Server ready on port 3000.'));
module.exports = app;


