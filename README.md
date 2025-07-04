# Anvaya CRM - Backend

## API Reference
### AGENTS
### **GET /agents**<br>
Get all sales agents<br>
Sample Response:<br>
```
{_id, name, email}
```
### **POST /agents**<br>
Add a new sales agent<br>
Sample Response:<br>
```
{_id, name, email}
```
### **DELETE /agents/:id**<br>
Delete a sales agent<br>
Sample Response:<br>
```
{message, deletedAgent}
```

### LEADS
### **GET /leads**<br>
Get all leads<br>
Sample Response:<br>
```
{_id, name, source, salesAgent, status, tags, timeToClose, priority}
```
### **POST /leads**<br>
Create a new Lead<br>
Sample Response:<br>
```
{_id, name, source, salesAgent, status, tags, timeToClose, priority}
```
### **PUT /leads/:id**<br>
Update a lead<br>
Sample Response:<br>
```
{_id, name, source, salesAgent, status, tags, timeToClose, priority}
```
### **DELETE /leads/:id**<br>
Delete a lead<br>
Sample Response:<br>
```
{message, deletedLead}
```

### Comments
### **POST /leads/:id/comments**<br>
Create a comment for the given lead id.<br>
Sample Response:<br>
```
{_id, lead, author, commentText}
```
### **GET /leads/:id/comments**<br>
Get all comments for given lead id.<br>
Sample Response:<br>
```
{_id, lead, author, commentText}
```
### **DELETE /comments/:id**<br>
Delete Comment of given id.<br>
Sample Response:<br>
```
{_id, message, deletedComment}
```

### TAGS
### **POST /tags**<br>
Create a tag.<br>
Sample Response:<br>
```
{_id, name}
```
### **GET /tags**<br>
Get all tags.<br>
Sample Response:<br>
```
{_id, name}
```

### REPORT
### **GET /report/last-week**<br>
Get all leads closed last week.<br>
Sample Response:<br>
```
{_id, name, salesAgent, closedAt}
```
### **GET /report/closed-by-agent**<br>
Get all leads closed by Sales Agent.<br>
Sample Response:<br>
```
{salesAgentId, salesAgentName, closedLeadsCount}
```
### **GET /report/pipeline<br>
Get all leads that aren't closed.<br>
Sample Response:<br>
```
{totalLeadsInPipeline}
```

---

## Anvaya CRM - Product Requirements Checklist (PRD)

This checklist helps track core features and development progress for the backend of Anvaya CRM app.

---

## Core Features
## Leads
- [x] Lead Creation (`POST /leads`)
- [x] Fetch Leads with Filtering (`GET /leads?salesAgent=&status=`)
- [x] Update Lead Details (`PUT /leads/:id`)
- [x] Delete Lead (`DELETE /leads/:id`)
- [x] Lead Status Workflow (e.g. New, Contacted, Qualified, Proposal Sent, Closed)
- [x] Assign/Reassign Sales Agents

---

## Comments

- [x] Add Comment to Lead (`POST /leads/:id/comments`)
- [x] Fetch Lead Comments (`GET /leads/:id/comments`)
- [x] Display comment author and timestamp

---

## Sales Agent Management

- [x] Add New Sales Agent (`POST /agents`)
- [x] List Sales Agents (`GET /agents`)
- [x] Delete Sales Agent

---

## Tags

- [x] Create Tags (`POST /tags`)
- [x] Fetch Tags (`GET /tags`)
- [x] Assign multiple tags to leads

---

## Reporting & Analytics

- [x] Leads Closed Last Week (`GET /report/last-week`)
- [x] Leads by Status (`GET /report/pipeline`)
- [x] Leads Closed by Sales Agent (`GET /report/closed-by-agent`)

---

## Future Goals

- [ ] Authentication & Authorization
- [ ] useContext for global state management

---

## Getting Started with the app
- npm init -y => Installs package.json
- Install necessary packages using npm install express mongoose cors dotenv etc
  
