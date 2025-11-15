# **Software Requirements Specification (SRS)**

## **1. Introduction**

This SRS defines the functional, non-functional, and architectural requirements for OpenFillIQ’s MVP release. It is designed for local-first development with a maintainable codebase suitable for extension into cloud-based functionality later.

---

## **2. System Overview**

OpenFillIQ consists of:
• A browser extension
• Content scripts for detecting and interacting with web forms
• Background service worker for storage and messaging
• Popup UI for profile management
• Local storage engine (AES-based encryption)
• Field mapping and autofill engine

No external service dependencies.

---

## **3. Functional Requirements**

### **3.1 Browser Extension Structure**

**REQ-FE-01**: The extension must be built using Manifest V3
**REQ-FE-02**: Components must include:
• content script
• background worker
• popup UI
• options/settings page
• modular JS/TS codebase

---

## **3.2 Field Detection Requirements**

**REQ-FD-01**: Detect all `<input>`, `<textarea>`, `<select>` elements
**REQ-FD-02**: Extract metadata:
• name
• id
• class
• label text
• placeholder
• aria-label
• surrounding text context

**REQ-FD-03**: Support dynamic forms using MutationObservers
**REQ-FD-04**: Identify multi-step form navigations

---

## **3.3 Field Classification Requirements (Heuristic Engine)**

**REQ-FC-01**: Create a fixed ontology of supported fields:
• first_name
• last_name
• full_name
• email
• phone
• address_line1
• address_line2
• city
• state
• postal_code

**REQ-FC-02**: Classification Rules (examples):
• if label contains “first”, map to first_name
• if placeholder contains “email”, map to email
• if name attribute matches `/phone|tel/`, map to phone

**REQ-FC-03**: Provide a confidence score for each match
**REQ-FC-04**: Provide fallback rules

---

## **3.4 Autofill Engine Requirements**

**REQ-AF-01**: Fill identified fields with user profile values
**REQ-AF-02**: Fire synthetic events (`input`, `change`) after filling
**REQ-AF-03**: Avoid overwriting hidden or password fields
**REQ-AF-04**: Provide Undo Autofill

---

## **3.5 Local Storage Requirements**

**REQ-ST-01**: Use browser local storage or IndexedDB
**REQ-ST-02**: Encrypt data using AES-256
**REQ-ST-03**: Never transmit data externally
**REQ-ST-04**: Support export and import of profile data

---

## **3.6 Popup UI Requirements**

**REQ-UI-01**: Users can view and edit personal information
**REQ-UI-02**: Users can add additional profiles (later phase)
**REQ-UI-03**: Users can toggle autofill on/off
**REQ-UI-04**: Clear all stored data option

---

## **3.7 Inline Autofill Button**

**REQ-IB-01**: When a form is detected, show a small button near the first input
**REQ-IB-02**: Button should trigger the autofill engine
**REQ-IB-03**: Button should not obstruct UI elements

---

## **4. Non-Functional Requirements**

### **4.1 Performance**

• Field detection under 30 ms
• Autofill under 20 ms
• Extension idle CPU 0%

### **4.2 Security**

• Zero-knowledge local data
• No external network requests
• No analytics (MVP)

### **4.3 Maintainability**

• Modular folder structure
• Strong TypeScript types
• Clear dependency isolation
• ESLint + Prettier
• Unit tests for core modules

---

## **5. Architecture Overview (MVP)**

### **Component Diagram (Simplified)**

```
/extension
 /content
 formDetector.ts
 classifier.ts
 autofillEngine.ts
 uiInjector.ts
 /background
 storageService.ts
 /popup
 popup.html
 popup.ts
 /common
 types.ts
 crypto.ts
 logger.ts
manifest.json
```

Each module is isolated and testable.

---

## **6. Testing Requirements**

### **Unit Tests**

• field detection module
• field classification rules
• autofill insertion logic
• crypto utilities

### **Integration Tests**

• form detection on sample HTML
• autofill end-to-end

### **Manual Tests**

• Job application forms
• Booking forms
• Newsletter popups
• Simple login/sign-up pages

---

## **7. Future Extensions (Not for MVP)**

• Cloud sync
• ML-powered field classification
• Profile templates
• Enterprise deployment
• Mobile browser support
• API for partner integrations
