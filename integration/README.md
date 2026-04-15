# Caller AI Widget SDK

Premium AI caller widget that can be embedded into any website or application.

## 🚀 HTML Integration

Add the following script to your website and include a div with your agent ID.

```html
<!-- 1. Include the SDK -->
<script src="https://YOUR_BACKEND_URL/widget.js"></script>

<!-- 2. Target element with Agent ID -->
<div id="caller-ai" data-agent-id="YOUR_AGENT_ID"></div>
```

## ⚛️ React Integration

Import and use the `CallerWidget` component.

```jsx
import { CallerWidget } from 'caller-ai-sdk';

function App() {
  return (
    <CallerWidget 
      agentId="YOUR_AGENT_ID" 
      backendUrl="https://YOUR_BACKEND_URL" 
    />
  );
}
```

## 🛠️ Configuration

The widget reads the following from the container element:
- `data-agent-id`: (Required) The ID of the AI agent to use.

## 🔒 Security

This SDK uses only public Agent IDs. All call initiations are validated and processed on the backend to ensure your environment keys remain secure.
