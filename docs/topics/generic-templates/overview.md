---
id: overview
title: Overview
sidebar_label: Overview
---

We have hosted a basic document renderer to handle various generic templates that we have prepared, in order to render out the UI of the respective documents.

Currently the generic templates renderer handles these templates:

- Bill of Lading
- Bill of Lading (Generic)
- Certificate of Origin
- Covering Letter
- Invoice
- XmlRenderer

Refer to github [source code](https://github.com/TradeTrust/generic-templates/tree/master/src/templates) for more information.

> For a preview of the templates, see [Generic Templates - Storybook](https://storybook.generic-templates.tradetrust.io/?path=/story/billoflading--bill-of-lading-v-3) and reference the source code on it's usage.

> Do note that this generic template renderer is for demo purposes, it is required for user to set up their own document renderer for anything production-ready needs. To find out more on how to set up your own document renderer, do visit the topic on [Decentralized Document Renderer](/docs/reference/configuration/create-custom-renderer).
