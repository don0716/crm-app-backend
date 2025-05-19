# Anvaya CRM - Product Requirements Checklist (PRD)

This checklist helps track core features and development progress for the Anvaya CRM app.

---

## Core Features

- [ ] Lead Creation (`POST /leads`)
- [ ] Fetch Leads with Filtering (`GET /leads?salesAgent=&status=`)
- [ ] Update Lead Details (`PATCH /leads/:id`)
- [ ] Delete Lead (`DELETE /leads/:id`)
- [ ] Lead Status Workflow (e.g. New, Contacted, Qualified, Proposal Sent, Closed)
- [ ] Assign/Reassign Sales Agents

---

## Comments Module

- [ ] Add Comment to Lead (`POST /leads/:id/comments`)
- [ ] Fetch Lead Comments (`GET /leads/:id/comments`)
- [ ] Display comment author and timestamp

---

## Sales Agent Management

- [ ] Add New Sales Agent (`POST /agents`)
- [ ] List Sales Agents (`GET /agents`)
- [ ] (Optional) Edit/Delete Sales Agent

---

## Tags

- [ ] Create Tags (`POST /tags`)
- [ ] Fetch Tags (`GET /tags`)
- [ ] Assign multiple tags to leads

---

## Reporting & Analytics

- [ ] Leads Closed Last Week (`GET /report/last-week`)
- [ ] Leads by Status (`GET /report/pipeline`)
- [ ] Leads Closed by Sales Agent (`GET /report/closed-by-agent`)
- [ ] Visualize data with Chart.js (pie charts, bar charts)

---

## Frontend Features (React)

- [ ] Lead Form UI (Create/Edit Leads)
- [ ] Lead List with Filters (status, tags, source, agent)
- [ ] Lead Details View with Comments
- [ ] Lead Status View (grouped by status)
- [ ] Sales Agent View (grouped by agent)
- [ ] Reports Dashboard with Charts
- [ ] URL-based filtering with React Router

---

## Other Considerations

- [ ] Authentication & Authorization (future)
- [ ] useContext for global state management
- [ ] Well-structured folder hierarchy
- [ ] API integration with Axios

---

## Getting Started with the app
- npm init -y => Installs package.json
- Install necessary packages using npm install express mongoose cors dotenv etc
  
