---
id: troubleshooting
title: Document Preview Templates Troubleshooting
sidebar_label: Troubleshooting
---

# Document Preview Templates Troubleshooting

This guide helps you diagnose and resolve common issues you might encounter when working with TradeTrust document preview templates.

## Common Issues and Solutions

### Template Not Rendering

#### Issue: Document shows a blank screen or error message instead of the template

**Possible Causes and Solutions:**

1. **Template name mismatch**
   
   The template name in the document's `$template.name` field doesn't match the key in your template registry.

   ```javascript
   // Document
   {
     "$template": {
       "name": "BILL_OF_LADING", // This must match exactly
       "type": "EMBEDDED_RENDERER",
       "url": "http://localhost:3000"
     }
   }
   
   // Template Registry
   export const registry = {
     "BILL_OF_LADING": billOfLadingTemplates, // Must match the name in $template
     // ...
   };
   ```

   **Solution**: Ensure the template name in the document matches the key in your registry exactly (case-sensitive).

2. **Incorrect renderer URL**
   
   The URL specified in the document's `$template.url` field is incorrect or unreachable.

   **Solution**: Verify that the URL is correct and the renderer server is running at that address.

3. **Missing template component**
   
   The template component might not be properly exported or registered.

   **Solution**: Check that your template component is correctly exported and registered in the template registry.

4. **JavaScript errors in the template**
   
   JavaScript errors in your template code can prevent rendering.

   **Solution**: Check your browser's console for error messages. Fix any JavaScript errors in your template code.

### Styling Issues

#### Issue: Template doesn't look as expected

**Possible Causes and Solutions:**

1. **CSS conflicts**
   
   External CSS might be conflicting with your template styles.

   **Solution**: Use more specific CSS selectors or consider using CSS-in-JS solutions like Emotion with unique class names.

   ```jsx
   // Use more specific selectors
   const containerStyle = css`
     && {
       font-family: Arial, sans-serif;
       color: #333;
     }
   `;
   ```

2. **Responsive design issues**
   
   The template might not be designed to be responsive.

   **Solution**: Use responsive CSS units (%, rem, em) and media queries to ensure your template works on different screen sizes.

   ```jsx
   const containerStyle = css`
     width: 100%;
     max-width: 800px;
     margin: 0 auto;
     
     @media (max-width: 768px) {
       padding: 10px;
       font-size: 14px;
     }
   `;
   ```

3. **Print layout issues**
   
   The template might not be optimized for printing.

   **Solution**: Add print-specific styles using `@media print` queries.

   ```jsx
   const GlobalPrintStyles = () => (
     <Global
       styles={css`
         @media print {
           body {
             font-size: 12pt;
             color: #000;
           }
           
           .no-print {
             display: none;
           }
         }
       `}
     />
   );
   ```

### Data Handling Issues

#### Issue: Template doesn't display all expected data

**Possible Causes and Solutions:**

1. **Missing or null data fields**
   
   The document might be missing expected fields or contain null values.

   **Solution**: Implement defensive coding practices to handle missing data gracefully.

   ```jsx
   // Use optional chaining and nullish coalescing
   <div>
     <h3>Shipper</h3>
     <p>{document?.shipper?.name ?? "Not specified"}</p>
     <p>{document?.shipper?.address ?? "Address not provided"}</p>
   </div>
   ```

2. **Incorrect data structure**
   
   The document data structure might not match what your template expects.

   **Solution**: Validate the document structure and provide clear error messages.

   ```jsx
   const validateDocument = (doc) => {
     const requiredFields = ["blNumber", "shipper", "consignee"];
     const missingFields = requiredFields.filter(field => !doc[field]);
     
     if (missingFields.length > 0) {
       console.error(`Document missing required fields: ${missingFields.join(", ")}`);
       return false;
     }
     
     return true;
   };
   
   const Template = ({ document }) => {
     if (!validateDocument(document)) {
       return <div className="error">Invalid document structure</div>;
     }
     
     // Render template normally
   };
   ```

3. **Data type mismatches**
   
   The data types in the document might not match what your template expects.

   **Solution**: Implement type checking and conversion where necessary.

   ```jsx
   // Convert string to date if needed
   const formatDate = (dateString) => {
     try {
       return new Date(dateString).toLocaleDateString();
     } catch (e) {
       console.error(`Invalid date: ${dateString}`);
       return "Invalid date";
     }
   };
   ```

### Performance Issues

#### Issue: Template renders slowly or causes browser lag

**Possible Causes and Solutions:**

1. **Large document size**
   
   The document might contain a large amount of data.

   **Solution**: Optimize your template to handle large data sets efficiently.

   ```jsx
   // Use virtualization for long lists
   import { FixedSizeList } from 'react-window';
   
   const ItemList = ({ items }) => {
     const Row = ({ index, style }) => (
       <div style={style}>
         <div>{items[index].name}</div>
         <div>{items[index].description}</div>
       </div>
     );
     
     return (
       <FixedSizeList
         height={400}
         width="100%"
         itemCount={items.length}
         itemSize={50}
       >
         {Row}
       </FixedSizeList>
     );
   };
   ```

2. **Inefficient rendering**
   
   The template might be re-rendering unnecessarily.

   **Solution**: Use React's memoization techniques to prevent unnecessary re-renders.

   ```jsx
   import React, { useMemo } from "react";
   
   const MemoizedComponent = React.memo(({ data }) => {
     // Component logic
   });
   
   const Template = ({ document }) => {
     const processedData = useMemo(() => {
       return expensiveDataProcessing(document.data);
     }, [document.data]);
     
     return <MemoizedComponent data={processedData} />;
   };
   ```

3. **Heavy dependencies**
   
   Your template might be using heavy libraries that slow down rendering.

   **Solution**: Consider using lighter alternatives or lazy-loading heavy dependencies.

   ```jsx
   // Lazy load heavy components
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
   
   const Template = () => {
     return (
       <React.Suspense fallback={<div>Loading...</div>}>
         <HeavyComponent />
       </React.Suspense>
     );
   };
   ```

### Integration Issues

#### Issue: Template doesn't work with TradeTrust verification

**Possible Causes and Solutions:**

1. **Missing verification handling**
   
   Your template might not be handling the verification status correctly.

   **Solution**: Implement proper verification status handling in your template.

   ```jsx
   const DocumentTemplate = ({ document, handleObfuscation }) => {
     // Use the handleObfuscation prop for verification features
     return (
       <div>
         <button onClick={() => handleObfuscation(["key.to.obfuscate"])}>
           Obfuscate Field
         </button>
         {/* Rest of template */}
       </div>
     );
   };
   ```

2. **Incorrect document format**
   
   The document might not be in the correct OpenAttestation format.

   **Solution**: Ensure your document follows the OpenAttestation v2 or v3 schema.

   ```javascript
   // Example of correct OpenAttestation v2 document structure
   const document = {
     issuers: [
       {
         name: "Demo Issuer",
         identityProof: {
           type: "DNS-TXT",
           location: "example.com"
         }
       }
     ],
     $template: {
       name: "BILL_OF_LADING",
       type: "EMBEDDED_RENDERER",
       url: "http://localhost:3000"
     },
     // Document-specific fields
   };
   ```

### Storybook Issues

#### Issue: Storybook stories not working correctly

**Possible Causes and Solutions:**

1. **Storybook configuration issues**
   
   Your Storybook configuration might be incorrect.

   **Solution**: Check your `.storybook/main.js` and `.storybook/preview.js` files for correct configuration.

   ```javascript
   // .storybook/main.js
   module.exports = {
     stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
     addons: [
       '@storybook/addon-links',
       '@storybook/addon-essentials',
     ],
   };
   ```

2. **Missing dependencies**
   
   Your stories might be missing required dependencies.

   **Solution**: Ensure all required dependencies are installed and imported.

   ```jsx
   // Make sure to import all required dependencies
   import React from 'react';
   import { action } from '@storybook/addon-actions';
   import { Template } from './template';
   import { sampleData } from './sample';
   
   export default {
     title: 'Templates/BillOfLading',
     component: Template,
   };
   
   export const Default = () => (
     <Template 
       document={sampleData} 
       handleObfuscation={action('handleObfuscation')}
     />
   );
   ```

## Deployment Issues

#### Issue: Template works locally but not in production

**Possible Causes and Solutions:**

1. **URL configuration**
   
   The renderer URL in the document might be set to localhost.

   **Solution**: Update the URL to point to your production renderer.

   ```javascript
   // Development
   const document = {
     $template: {
       name: "BILL_OF_LADING",
       type: "EMBEDDED_RENDERER",
       url: "http://localhost:3000"
     }
   };
   
   // Production
   const document = {
     $template: {
       name: "BILL_OF_LADING",
       type: "EMBEDDED_RENDERER",
       url: "https://renderer.example.com"
     }
   };
   ```

2. **CORS issues**
   
   Cross-Origin Resource Sharing (CORS) might be blocking the renderer in production.

   **Solution**: Configure your server to allow CORS from the domains where your documents will be viewed.

   ```javascript
   // Express.js example
   const express = require('express');
   const cors = require('cors');
   const app = express();
   
   // Allow specific origins
   app.use(cors({
     origin: [
       'https://example.com',
       'https://app.example.com'
     ]
   }));
   
   // Or allow all origins (less secure)
   // app.use(cors());
   ```

3. **Build configuration**
   
   Your production build might be missing required files or configurations.

   **Solution**: Check your build process and ensure all required files are included in the production build.

   ```javascript
   // webpack.config.js example
   module.exports = {
     // ...
     resolve: {
       fallback: {
         "crypto": require.resolve("crypto-browserify"),
         "stream": require.resolve("stream-browserify"),
         // Add other polyfills as needed
       }
     }
   };
   ```

## Advanced Troubleshooting

### Debugging Templates

1. **Use React Developer Tools**
   
   Install the React Developer Tools browser extension to inspect your component tree and props.

2. **Add debug logging**
   
   Add temporary console logs to track the flow of data through your template.

   ```jsx
   const Template = ({ document }) => {
     console.log('Template rendering with document:', document);
     
     // Rest of component
   };
   ```

3. **Create simplified test cases**
   
   If you're experiencing complex issues, create a simplified version of your template to isolate the problem.

### Getting Help

If you're still experiencing issues after trying the solutions in this guide:

1. Check the [TradeTrust GitHub repository](https://github.com/TradeTrust/tradetrust-website) for known issues or to report a new one.
2. Review the [OpenAttestation documentation](https://www.openattestation.com/) for more information on document standards.

## Conclusion

This troubleshooting guide covers the most common issues you might encounter when working with TradeTrust document preview templates. By following the solutions provided, you should be able to resolve most problems and create robust, reliable templates for your documents.

For more information on creating templates, refer to the [Template Implementation Examples](/docs/how-tos/document-preview-templates/template-implementation-examples) and [Best Practices](/docs/how-tos/document-preview-templates/best-practices) guides.
