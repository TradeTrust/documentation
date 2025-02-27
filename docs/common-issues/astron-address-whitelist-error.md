---
id: astron-address-whitelist-error
title: "Astron L2 Transaction Error: Account not in Whitelist"
sidebar_label: "Astron L2 Transaction Error: Account not in Whitelist"
keywords: ['{"jsonrpc":"2.0","id":56,"error":{"code":-32000,"message":"tx source account not in accWhiteList"}}', tx source account not in accWhiteList, astron ]
---

The `{"jsonrpc":"2.0","id":56,"error":{"code":-32000,"message":"tx source account not in accWhiteList"}}` error occurs on the Astron network for transactions.

```
Error: processing response error (body="{\"jsonrpc\":\"2.0\",\"id\":56,\"error\":{\"code\":-32000,\"message\":\"tx source account not in accWhiteList\"}}\n", error={"code":-32000}, requestBody="{\"method\":\"eth_sendRawTransaction\",\"params\":[\"0xf885808082b66d94ae9e5b452131d86b541b0df60483c382a4ca112280a4b332180b000000000000000000000000ca93690bb57eeab273c796a9309246bc0fb93649820a97a0ac3286c04c385c9b1676faddfc15c8d03ccd705cd92b858452ef020bd1a54022a00b267774ccb49cc289851c2879753a7f43f912fe802ee690ad02cb33d79cb925\"],\"id\":56,\"jsonrpc\":\"2.0\"}", requestMethod="POST", url="https://astronlayer2.bitfactory.cn/rpc/", code=SERVER_ERROR, version=web/5.7.1)
```

To resolve this issue, ensure that your wallet address is whitelisted before attempting to transact on the Astron L2 network.

More information regarding the whitelist will be provided. For any inquiries or additional information, feel free to contact us at tradetrust@imda.gov.sg.
