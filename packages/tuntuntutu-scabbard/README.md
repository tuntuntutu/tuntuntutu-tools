# tuntuntutu-scabbard
---
tuntuntutu的本地服务和打包配置

### 安装
---

*如果项目通过`tuntuntutu`创建，则不需要单独安装。*

```
yarn add tuntuntutu-scabbard -D
// or
npm install tuntuntutu-scabbard --save-dev
```
### 指令
**serve**

开启本地服务`tuntuntutu-scabbard serve`
<table>
  <tr>
  	<th>参数</th>
	<th>默认值</th>
	<th>说明</th>
	<th>示例</th>
  </tr>
  <tr>
  	<td>--https</td>
  	<td>false</td>
  	<td>使用https</td>
  	<td>tuntuntutu-scabbard serve --https</td>
  </tr>
  <tr>
  	<td>--host</td>
  	<td>本机ip</td>
  	<td>修改host</td>
  	<td>tuntuntutu-scabbard serve --host 127.0.0.1</td>
  </tr>
  <tr>
  	<td>--port</td>
  	<td>8088</td>
  	<td>修改端口</td>
  	<td>tuntuntutu-scabbard serve --port 8888</td>
  </tr>
  <tr>
  	<td>--open</td>
  	<td>false</td>
  	<td>自动打开浏览器</td>
  	<td>tuntuntutu-scabbard serve --open</td>
  </tr>
  <tr>
  	<td>--env</td>
  	<td>development</td>
  	<td>修改全局变量ENV的值</td>
  	<td>tuntuntutu-scabbard serve --env stable</td>
  </tr>
</table>

**build**

打包编译  `tuntuntutu-scabbard build`
<table>
  <tr>
  	<th>参数</th>
	<th>默认值</th>
	<th>说明</th>
	<th>示例</th>
  </tr>
  <tr>
  	<td>-R, --no-root</td>
  	<td>false</td>
  	<td>是否设置publicPath</td>
  	<td>tuntuntutu-scabbard build -R</td>
  </tr>
  <tr>
  	<td>-n, --project-name</td>
  	<td>tuntuntutu.config.js中的name</td>
  	<td>publicPath的值</td>
  	<td>tuntuntutu-scabbard build -n my-app</td>
  </tr>
  <tr>
  	<td>--cdn</td>
  	<td>无</td>
  	<td>设置cdn地址</td>
  	<td>tuntuntutu-scabbard build --cdn https://cdn.xxxx.cn</td>
  </tr>
  <tr>
  	<td>--env</td>
  	<td>production</td>
  	<td>修改全局变量ENV的值</td>
  	<td>tuntuntutu-scabbard build --env stable</td>
  </tr>
</table>



### 配置文件
`tuntuntutu-scabbard`的功能依赖于`tuntuntutu.config.js`

```
// tuntuntutu.config.js
module.exports = {
  // 项目名称，执行 tuntuntutu-scabbard build -R 时的 publicPath 的默认值
  name: 'my-app',

  // 终端类型(pc|mobile)
  platform: 'pc',

  // 项目类型(mpa|spa|lite)
  type: 'spa',
  
  // 自定义antd的主题
  // 参考地址: https://ant.design/docs/react/customize-theme-cn
  theme: {
      'primary-color': '#14161a',
  },

  // webpack-dev-server的proxy
  // 详细配置可参考https://webpack.js.org/configuration/dev-server/#devserver-proxy
  proxy: {
	'/api': 'http://localhost:3000'
  },
};

```

