# Kiro Team Onboarding Guide

## Test Account Credentials
- **Username**: kirotester@tester.com
- **Password**: KiroTester@@27

---

## HR Policies & Benefits

### PTO Policy
Employees are offered **20 days of paid time off (PTO) annually**. Unused PTO days can be carried over into the next year, with a maximum carryover limit of **5 days**. Any days exceeding this limit will be forfeited at the end of the calendar year.

### Sick Leave Protocol
If you need sick leave, you must log the time in **BambooHR within 24 hours** of your absence. Additionally, you are required to notify your direct manager via **Slack direct message** as soon as possible, preferably before your scheduled start time.

For absences of **four or more consecutive days**, you must upload a doctor's note to BambooHR **within 48 hours** of returning to work.

### Remote Work Stipend
Remote employees are eligible for a monthly stipend of **$75** to cover utilities such as internet and electricity. To claim this stipend, submit your expenses in **Expensify** under the claim category **"Remote Work - Utilities"**.

### Performance Review Cycle
Performance is formally reviewed on a **quarterly basis** (every 3 months). The final performance score uses a **5-point rating scale**:
- 1 = Needs Improvement
- 2 = Below Expectations
- 3 = Meets Expectations
- 4 = Exceeds Expectations
- 5 = Outstanding

---

## Expense & Travel Policies

### Travel Meal Per Diem
The maximum per diem cap for travel meals is **$60 per day**. This covers breakfast, lunch, and dinner combined. Alcohol is not included in the per diem and must be expensed separately with manager approval.

### Receipt Requirements
Any expense of **$25 or more** requires attaching a clear photograph of the original receipt. Expenses below this threshold can be submitted without a receipt, but a brief description is still required.

---

## Engineering Policies & Workflows

### Pull Request Review Process
All pull requests (PRs) to the main branch require a minimum of **2 L4+ approvals** before merging. Reviewers must complete their review within **4 hours during standard working hours** (9 AM - 6 PM local time). If a review is not completed within this timeframe, the PR author should escalate to the engineering lead.

### Code Quality Standards
Any new feature branch must meet a minimum code quality gate score of **85%**. This score is calculated based on three factors:
1. **Test coverage** (minimum 80%)
2. **Linting compliance** (zero critical errors)
3. **Security scan results** (no high or critical vulnerabilities)

### Framework Migration Project
All legacy Next.js 13 services must be refactored under the mandatory project named **"Phoenix Migration"**. This project aims to upgrade all services to Next.js 14+ with the App Router architecture by Q2 2026.

### Deployment & Infrastructure
The following three technologies are mandatory for all backend services:
1. **Docker** - for containerizing services
2. **Kubernetes** - for orchestration and scaling
3. **HashiCorp Vault** - for managing secrets and sensitive configuration

### API Standards & Conventions
When defining new API endpoints, follow these formatting rules:
- **Query parameters**: Use snake_case (e.g., `user_id`, `workspace_id`)
- **JSON body properties**: Use camelCase (e.g., `userId`, `workspaceId`)
- **Response objects**: Use camelCase consistently

Example:
```
GET /api/users?user_id=123
POST /api/users
Body: { "firstName": "John", "lastName": "Doe", "userId": "123" }
```

---

## RAG System & Documentation

### Knowledge Chatbot Specifications
The official name of the knowledge chatbot is **"quickOnboardDoc AI Assistant"**. The system uses **Pinecone** as the vector database to store and retrieve the knowledge base embeddings.

### Document Ingestion Rules
The RAG system currently supports the following file formats for ingestion:
- **PDF** (.pdf)
- **DOCX** (.docx)
- **Plain Text** (.txt)
- **Markdown** (.md)

**Unsupported formats** (explicitly listed):
- **PowerPoint presentations** (.ppt, .pptx)
- **Excel spreadsheets** (.xls, .xlsx)

Documents must be under 10MB in size and contain primarily text content. Image-heavy documents may have reduced accuracy.

---

## Organizational Structure & Contacts

### Product Team Leadership
The Product team is led by **Sarah Chen**. Her primary communication channel is **Slack (@sarah.chen)**. For urgent product-related matters, you can also reach her via email at sarah.chen@kiro.dev.

### Documentation Workflow
All draft documents should be stored in **Notion** under the appropriate team workspace. Once a document is finalized and approved, it is migrated to **Confluence**, which acts as the **central source of truth** that feeds the official documentation into the quickOnboardDoc RAG system.

The documentation sync process runs automatically every 6 hours, pulling approved content from Confluence into the knowledge base.

---

## Quick Reference Summary

| Topic | Key Information |
|-------|----------------|
| Annual PTO | 20 days (max 5 day carryover) |
| PR Approvals | Minimum 2 L4+ approvals |
| Review Time Limit | 4 hours during working hours |
| Meal Per Diem | $60/day maximum |
| Receipt Threshold | $25 or more |
| Code Quality Gate | 85% minimum |
| Migration Project | Phoenix Migration |
| Deployment Stack | Docker + Kubernetes + Vault |
| Vector Database | Pinecone |
| Chatbot Name | quickOnboardDoc AI Assistant |
| Supported Formats | PDF, DOCX, TXT, MD |
| Unsupported Formats | PPT, PPTX, XLS, XLSX |
| Sick Leave Logging | Within 24 hours in BambooHR |
| Manager Notification | Slack DM immediately |
| Doctor's Note Deadline | 48 hours for 4+ day absences |
| Remote Stipend | $75/month via Expensify |
| Performance Reviews | Quarterly (5-point scale) |
| Product Lead | Sarah Chen (@sarah.chen) |
| Draft Storage | Notion |
| Final Documentation | Confluence (feeds RAG) |

---

## Testing Instructions for Kiro Team

1. **Login** with the test account credentials provided above
2. **Upload this document** to the storage page
3. **Wait for processing** (should take 30-60 seconds)
4. **Navigate to AI Chat** and ask the questions listed below
5. **Verify accuracy** of responses against this document

### Test Questions

**PTO Policy Check:**
- "How many days of paid time off (PTO) are offered annually, and what is the policy regarding carrying over unused days into the next year?"

**Engineering Workflow & Review:**
- "What is the minimum number of L4+ approvals required for a pull request (PR) to merge to main, and what is the maximum time allowed for completing a review during standard working hours?"

**Expense & Receipt Thresholds:**
- "What is the maximum per diem cap for travel meals, and what is the dollar amount threshold for an expense that requires attaching a clear photograph of the original receipt?"

**RAG System Specifications:**
- "What is the official name of the knowledge chatbot, and which vector database is used to store the knowledge base?"

**Document Ingestion Rules:**
- "What file formats are currently supported for ingestion into the RAG system, and which two common document formats are specifically listed as unsupported?"

**Framework Migration:**
- "What specific project name is the mandatory refactoring of legacy Next.js 13 services operating under?"

**Code Quality:**
- "What is the exact minimum code quality gate score required for any new feature branch, and what three factors is this score calculated based on?"

**Deployment Tools:**
- "What three technologies are mandatory for containerizing backend services and managing secrets?"

**API Standards:**
- "If I'm defining a new API endpoint, how should I format the query parameters (like user_id) versus the JSON body properties?"

**Sick Leave Protocol:**
- "If I need two days off, how soon must I log the time in BambooHR, and what is the required method for notifying my direct manager?"

**Remote Stipend:**
- "What is the precise monthly stipend amount available for remote employees' utilities, and what is the claim category in Expensify?"

**Performance Cycle:**
- "How often is performance formally reviewed, and what is the rating scale used for the final score?"

**Medical Leave:**
- "For an absence of four or more days, what is the deadline (in hours) for uploading a doctor's note?"

**Contact Info:**
- "Who is the lead for the Product team, and what is their primary communication channel?"

**Documentation Flow:**
- "If I am working on a draft document, where should it be stored? Also, what system acts as the central source that feeds the official finalized documentation into the quickOnboardDoc RAG?"

---

## Expected Results

The AI should be able to answer all questions accurately by retrieving the relevant information from this document. Responses should be:
- **Accurate**: Match the information in this guide
- **Concise**: Direct answers without unnecessary elaboration
- **Natural**: Conversational tone, not robotic
- **Plain text**: No markdown formatting (**, *, #)

---

*Document Version: 1.0*  
*Last Updated: December 5, 2025*  
*Created for: Kiro Team Testing*
