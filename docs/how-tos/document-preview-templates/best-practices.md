---
id: best-practices
title: Document Preview Templates Best Practices
sidebar_label: Best Practices
---

# Document Preview Templates Best Practices

This guide provides best practices and recommendations for creating effective, maintainable, and user-friendly document preview templates for TradeTrust documents.

## Code Structure and Organization

### Modular Template Design

**Recommendation**: Organize your templates using a modular approach.

```
src/templates/
├── bill-of-lading/
│   ├── index.tsx          # Template registration
│   ├── sample.ts          # Data structure and sample data
│   ├── template.tsx       # Main template component
│   └── template.stories.tsx # Storybook stories
├── cover-letter/
│   ├── ...
└── index.tsx              # Main registry file
```

**Benefits**:
- Clear separation of concerns
- Easier maintenance and updates
- Better code reusability
- Simplified testing

### Component Composition

**Recommendation**: Break down complex templates into smaller, reusable components.

```jsx
// Bad practice - one large component
const BillOfLadingTemplate = ({ document }) => {
  return (
    <div>
      {/* Hundreds of lines of JSX */}
    </div>
  );
};

// Good practice - composed of smaller components
const BillOfLadingTemplate = ({ document }) => {
  return (
    <div>
      <Header document={document} />
      <ShipmentDetails document={document} />
      <CargoDetails document={document} />
      <Signatures document={document} />
    </div>
  );
};
```

**Benefits**:
- Improved readability
- Easier maintenance
- Component reusability across templates
- Simplified testing of individual components

## Performance Optimization

### Memoization

**Recommendation**: Use React's memoization techniques for expensive computations or rendering.

```jsx
import React, { useMemo } from "react";

const DocumentTemplate = ({ document }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return expensiveDataProcessing(document.data);
  }, [document.data]);

  return <div>{/* Render using processedData */}</div>;
};

// For component memoization
const MemoizedComponent = React.memo(DocumentTemplate);
```

### Optimize Rendering

**Recommendation**: Minimize unnecessary re-renders and optimize component rendering.

- Use `React.memo()` for functional components that render often with the same props
- Implement `shouldComponentUpdate` or extend `PureComponent` for class components
- Use the `key` prop correctly in lists to help React identify which items have changed

## Styling Best Practices

### CSS-in-JS with Emotion

**Recommendation**: Use Emotion's CSS-in-JS approach consistently with proper organization.

```jsx
// Group related styles together
const containerStyle = css`
  font-family: "Arial", sans-serif;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
`;

// Use theme variables for consistency
const headerStyle = css`
  color: ${theme.colors.primary};
  font-size: ${theme.fontSizes.large};
  margin-bottom: ${theme.spacing.medium};
`;
```

### Responsive Design

**Recommendation**: Ensure templates are responsive and work well on different screen sizes.

```jsx
const containerStyle = css`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 5px;
    font-size: 12px;
  }
`;
```

### Print-Friendly Styles

**Recommendation**: Include print-friendly styles for all document templates.

```jsx
import { Global } from "@emotion/core";

const PrintStyles = () => (
  <Global
    styles={css`
      @media print {
        body {
          font-size: 12pt;
          color: #000;
          background: #fff;
        }
        
        .no-print {
          display: none;
        }
        
        a {
          text-decoration: none;
          color: #000;
        }
        
        /* Ensure the document fits on the printed page */
        .document-container {
          width: 100%;
          margin: 0;
          padding: 0;
        }
      }
    `}
  />
);

// Include in your template
const DocumentTemplate = () => (
  <>
    <PrintStyles />
    <div className="document-container">
      {/* Document content */}
    </div>
  </>
);
```

## Accessibility

### Semantic HTML

**Recommendation**: Use semantic HTML elements to improve accessibility and SEO.

```jsx
// Bad practice
<div className="header">Document Title</div>
<div className="section">Section content...</div>

// Good practice
<header>
  <h1>Document Title</h1>
</header>
<section>
  <h2>Section Title</h2>
  <p>Section content...</p>
</section>
```

### ARIA Attributes

**Recommendation**: Use ARIA attributes when necessary to improve accessibility.

```jsx
<button 
  aria-label="Close document"
  aria-expanded={isExpanded}
  onClick={toggleExpand}
>
  {isExpanded ? "Collapse" : "Expand"}
</button>

<div 
  role="tabpanel"
  aria-labelledby="tab-1"
  id="panel-1"
>
  {/* Tab content */}
</div>
```

### Color Contrast

**Recommendation**: Ensure sufficient color contrast for text and important UI elements.

```jsx
// Bad - poor contrast
const poorContrastStyle = css`
  color: #999;
  background-color: #777;
`;

// Good - sufficient contrast
const goodContrastStyle = css`
  color: #fff;
  background-color: #333;
`;
```

## Testing and Quality Assurance

### Storybook Stories

**Recommendation**: Create comprehensive Storybook stories for each template and component.

```jsx
// Basic story
export const Default = () => <Template document={sampleData} />;

// Story with different data variations
export const WithMissingFields = () => <Template document={dataWithMissingFields} />;

// Story with interactive controls
export const Interactive = () => {
  const [data, setData] = useState(sampleData);
  
  return (
    <>
      <div className="controls">
        <button onClick={() => setData({...data, status: "COMPLETED"})}>
          Mark as Completed
        </button>
      </div>
      <Template document={data} />
    </>
  );
};
```

### Unit Testing

**Recommendation**: Write unit tests for template components using Jest and React Testing Library.

```jsx
import { render, screen } from "@testing-library/react";
import { BillOfLadingTemplate } from "./template";
import { sampleBillOfLading } from "./sample";

describe("BillOfLadingTemplate", () => {
  it("renders the bill number correctly", () => {
    render(<BillOfLadingTemplate document={sampleBillOfLading} />);
    expect(screen.getByText(`B/L No: ${sampleBillOfLading.blNumber}`)).toBeInTheDocument();
  });
  
  it("renders all cargo items", () => {
    render(<BillOfLadingTemplate document={sampleBillOfLading} />);
    sampleBillOfLading.cargo.forEach(item => {
      expect(screen.getByText(item.description)).toBeInTheDocument();
    });
  });
});
```

## Data Handling

### Type Safety

**Recommendation**: Use TypeScript interfaces for document data structures.

```typescript
// Define clear interfaces for your document data
export interface BillOfLadingDocument extends v2.OpenAttestationDocument {
  blNumber: string;
  shipper: {
    name: string;
    address: string;
  };
  consignee: {
    name: string;
    address: string;
  };
  vessel: string;
  voyageNo: string;
  portOfLoading: string;
  portOfDischarge: string;
  cargo: Array<{
    description: string;
    weight: number;
    measurement: string;
  }>;
}
```

### Defensive Rendering

**Recommendation**: Handle missing or incomplete data gracefully.

```jsx
// Use optional chaining and nullish coalescing
const renderShipperInfo = (document) => {
  return (
    <div>
      <h3>Shipper</h3>
      <p>{document?.shipper?.name ?? "Not specified"}</p>
      <p>{document?.shipper?.address ?? "Address not provided"}</p>
    </div>
  );
};

// Check array existence before mapping
const renderCargoItems = (document) => {
  return (
    <div>
      <h3>Cargo</h3>
      {document?.cargo?.length > 0 ? (
        document.cargo.map((item, index) => (
          <div key={index}>
            <p>{item.description ?? "No description"}</p>
            <p>{item.weight ? `${item.weight} ${item.measurement || ""}` : "Weight not specified"}</p>
          </div>
        ))
      ) : (
        <p>No cargo items listed</p>
      )}
    </div>
  );
};
```

## User Experience

### Loading States

**Recommendation**: Handle loading states gracefully.

```jsx
const DocumentViewer = ({ documentId }) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchDocument(documentId)
      .then(data => {
        setDocument(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [documentId]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!document) return <EmptyState message="No document found" />;
  
  return <DocumentTemplate document={document} />;
};
```

### Error Handling

**Recommendation**: Implement proper error boundaries and fallback UI.

```jsx
class DocumentErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    // Log error to monitoring service
    console.error("Document rendering error:", error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h3>Something went wrong while rendering this document</h3>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
          <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
const SafeDocumentRenderer = ({ document }) => (
  <DocumentErrorBoundary>
    <DocumentTemplate document={document} />
  </DocumentErrorBoundary>
);
```

## Security Considerations

### Sanitize User-Generated Content

**Recommendation**: Sanitize any user-generated content before rendering.

```jsx
import DOMPurify from "dompurify";

const SafeHTML = ({ html }) => {
  const sanitizedHTML = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

// Usage
const DocumentNote = ({ note }) => {
  return <SafeHTML html={note.content} />;
};
```

### Avoid Exposing Sensitive Data

**Recommendation**: Be careful not to expose sensitive data in your templates.

```jsx
// Bad practice - exposing private keys or sensitive data
const DocumentMetadata = ({ document }) => {
  return (
    <div>
      <p>Document ID: {document.id}</p>
      <p>Private Key: {document.privateKey}</p> {/* Don't do this! */}
    </div>
  );
};

// Good practice - only show necessary information
const DocumentMetadata = ({ document }) => {
  return (
    <div>
      <p>Document ID: {document.id}</p>
      <p>Created: {formatDate(document.createdAt)}</p>
      <p>Status: {document.status}</p>
    </div>
  );
};
```

## Deployment and Production

### Bundle Size Optimization

**Recommendation**: Optimize bundle size for production.

- Use code splitting to load templates on demand
- Implement tree shaking to eliminate unused code
- Optimize and compress images and other assets
- Consider using lightweight alternatives for heavy dependencies

### Version Control

**Recommendation**: Implement proper versioning for your templates.

```jsx
// Template registry with versioning
export const registry: TemplateRegistry<any> = {
  BILL_OF_LADING: [
    {
      id: "bill-of-lading-v2",
      label: "Bill of Lading (v2)",
      template: BillOfLadingTemplateV2,
    },
    {
      id: "bill-of-lading-v1",
      label: "Bill of Lading (v1)",
      template: BillOfLadingTemplateV1,
    },
  ],
};
```

## Conclusion

Following these best practices will help you create document preview templates that are maintainable, performant, accessible, and provide a great user experience. Remember that templates should be designed with both the end-user and developer experience in mind.

For more specific implementation details, refer to the [Template Implementation Examples](/docs/how-tos/document-preview-templates/template-implementation-examples) guide.
