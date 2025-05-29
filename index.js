const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");
const corsOptions = {
  origin:
    "https://crm-app-anvaya-git-main-donovans-projects-b7659c43.vercel.app",
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.mongoose");

initializeDatabase();

const Lead = require("./models/lead.model");
const SalesAgent = require("./models/salesAgent.model");
const Comment = require("./models/comment.model");
const Tag = require("./models/tag.model");
const salesAgentModel = require("./models/salesAgent.model");

// Add Sales Agent.
app.post("/agents", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newSalesAgent = new SalesAgent({ name, email });
    const savedSalesAgent = await newSalesAgent.save();
    if (savedSalesAgent) {
      res.status(201).json({
        message: "Sales Agent Added Successfully.",
        salesAgent: savedSalesAgent,
      });
    } else {
      res.status(404).json({ error: "Failed to Add Sales Agent." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get sales agents
app.get("/agents", async (req, res) => {
  try {
    const agents = await SalesAgent.find();
    if (agents.length > 0) {
      res.json({ message: "Agents Found", agentsData: agents });
    } else {
      res.status(404).json({ error: "Agents not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete Sales Agent.
app.delete("/agents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteAgent = await SalesAgent.findByIdAndDelete(id);
    if (deleteAgent) {
      res
        .status(200)
        .json({ message: "Agent deleted Successfully", agent: deleteAgent });
    } else {
      res.status(404).json({ error: `Agent with ID ${id} not Found. ` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Lead
app.post("/leads", async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    // Input validations (basic)
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Invalid input: 'name' is required." });
    }

    if (
      !source ||
      ![
        "Website",
        "Referral",
        "Cold Call",
        "Advertisement",
        "Email",
        "Other",
      ].includes(source)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid input: 'source' is invalid." });
    }

    if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
      return res
        .status(400)
        .json({ error: "Invalid input: 'salesAgent' must be a valid ID." });
    }

    const agentExists = await SalesAgent.findById(salesAgent);
    if (!agentExists) {
      return res
        .status(404)
        .json({ error: `Sales agent with ID '${salesAgent}' not found.` });
    }

    const newLead = new Lead({
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
    });
    const saveLead = await newLead.save();

    if (saveLead) {
      await saveLead.populate("salesAgent", "name");
      res
        .status(201)
        .json({ message: "Lead Created Successfully.", lead: saveLead });
    } else {
      res.status(400).json({ error: "Failed to Add Lead." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update a Lead
app.put("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status === "Closed") {
      updates.closedAt = new Date();
    }
    if (updates.status && updates.status !== "Closed") {
      updates.closedAt = null;
    }
    const updateLead = await Lead.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (updateLead) {
      res
        .status(200)
        .json({ message: "Lead Updated Successfully", updateLead });
    } else {
      res.status(404).json({ error: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete a Lead
app.delete("/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteLead = await Lead.findByIdAndDelete(id);
    if (deleteLead) {
      res
        .status(200)
        .json({ message: "Lead deleted Successfully", lead: deleteLead });
    } else {
      res.status(404).json({ error: `Lead with ID ${id} not Found. ` });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get Leads and query parameters.
app.get("/leads", async (req, res) => {
  try {
    const { salesAgent, status, tags, source, priority } = req.query;
    // input validation
    const validStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed",
    ];
    const validSources = [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ];
    const validPriority = ["High", "Medium", "Low"];
    const filter = {};
    // Validate salesAgent ObjectId
    if (salesAgent) {
      if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
        return res
          .status(400)
          .json({ error: "Invalid input: 'salesAgent' must be a valid ID." });
      }
      filter.salesAgent = salesAgent;
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: `invalid input: 'status' must be one of ${JSON.stringify(
            validStatuses
          )} `,
        });
      }
      filter.status = status;
    }

    if (priority) {
      if (!validPriority.includes(priority)) {
        return res.status(400).json({
          error: `invalid Input: "priority must be one of ${JSON.stringify(
            validPriority
          )} `,
        });
      }
      filter.priority = priority;
    }

    if (source) {
      if (!validSources.includes(source)) {
        return res.status(400).json({
          error: `Invalid input: 'source' must be one of ${JSON.stringify(
            validSources
          )}.`,
        });
      }
      filter.source = source;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(",");

      // Validate tags against database
      const existingTags = await Tag.find({ name: { $in: tagArray } });
      const validTagNames = existingTags.map((tag) => tag.name);
      const invalidTags = tagArray.filter(
        (tag) => !validTagNames.includes(tag)
      );

      if (invalidTags.length > 0) {
        return res.status(400).json({
          error: `Invalid tag(s): ${invalidTags.join(", ")}`,
        });
      }

      filter.tags = { $all: tagArray }; // Only use validated tags
    }

    // Post a comment to Lead
    app.post("/leads/:id/comments", async (req, res) => {
      try {
        const { commentText, author } = req.body;
        const leadId = req.params.id;

        const findLead = await Lead.findById(leadId);
        if (findLead) {
          const newComment = new Comment({
            lead: leadId,
            author,
            commentText,
          });
          const saveComment = await newComment.save();
          res.status(201).json({
            message: "Created Comment Successfully.",
            comment: saveComment,
          });
        } else {
          res.status(404).json({ error: "Lead does not exist." });
        }
      } catch (error) {
        res.status(500).json(error.message);
      }
    });

    const leads = await Lead.find(filter).populate("salesAgent");
    if (leads.length > 0) {
      res.status(200).json(leads);
    } else {
      res.status(401).json({ error: "No leads Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comments
// Post Comments.
app.post("/leads/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const { author, commentText } = req.body;
    const lead = await Lead.findById(id);

    // Validate Input
    if (!commentText || typeof commentText !== "string") {
      return res
        .status(400)
        .json({ error: `'commentText' is required and must be a string.` });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Lead ID." });
    }
    if (!lead) {
      return res.status(404).json({ error: "Lead not Found." });
    }
    const newComment = new Comment({
      lead: lead._id,
      author: author,
      commentText,
    });
    const saveComment = await newComment.save();
    res
      .status(201)
      .json({ message: "Comment Added Successfully.", comment: saveComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Delete Comments.
app.delete("/comments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteComment = await Comment.findByIdAndDelete(id);

    if (!deleteComment) {
      return res.status(404).json({ error: "Failed to Delete." });
    }

    res.status(201).json({
      message: "Comment Deleted Successfully.",
      comment: deleteComment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get comments
app.get("/leads/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;

    const comments = await Comment.find({ lead: id }).populate("author");
    if (comments.length > 0) {
      res.status(200).json(comments);
    } else {
      res.status(404).json({ error: "No Comments on this Lead." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TAGS
app.post("/tags", async (req, res) => {
  try {
    const name = req.body;
    const newTag = new Tag(name);
    const saveTag = await newTag.save();
    if (saveTag) {
      res.status(201).json({ message: "Created Tag", tag: saveTag });
    } else {
      res.status(404).json({ error: "Failed to create Tag." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/tags", async (req, res) => {
  try {
    const tags = await Tag.find();
    if (tags.length > 0) {
      res.status(201).json({ message: "Created Tag", tag: tags });
    } else {
      res.status(404).json({ error: "No Tags Found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REPORT
// Get leads closed last week.
app.get("/report/last-week", async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    // Find Leads with status "Closed" and closedAt data within last 7 days.
    const leads = await Lead.find({
      status: "Closed",
      closedAt: { $gte: sevenDaysAgo, $lte: now },
    }).populate("salesAgent", "name"); // populate sales agents name
    // Map resuslts to desired output
    const formattedLeads = leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      salesAgent: lead.salesAgent.name,
      closedAt: lead.closedAt,
    }));
    res.status(200).json(formattedLeads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get Leads Closed by Sales Agent.
app.get("/report/closed-by-agent", async (req, res) => {
  try {
    const closedLeads = await Lead.find({ status: "Closed" }).populate(
      "salesAgent"
    );
    const leadCounts = {};

    closedLeads.forEach((lead) => {
      const agent = lead.salesAgent;
      if (!agent) return; // skip if no agent for lead.

      const agentId = agent._id.toString();
      if (!leadCounts[agentId]) {
        //create new entry if, agent is not there in leadCounts object.
        leadCounts[agentId] = {
          salesAgentId: agentId,
          salesAgentName: agent.name,
          closedLeadsCount: 0,
        };
      }
      leadCounts[agentId].closedLeadsCount++;
    });
    const result = Object.values(leadCounts);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all leads that aren't closed.
app.get("/report/pipeline", async (req, res) => {
  try {
    const leads = await Lead.find();
    let leadsCounter = 0;
    leads.map((lead) => {
      if (lead.status !== "Closed") {
        leadsCounter += 1;
      }
    });
    res.status(200).json({ totalLeadsInPipeline: leadsCounter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
