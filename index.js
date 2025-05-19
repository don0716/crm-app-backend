const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "*",
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

// Add Lead
app.post("/leads", async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

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
      res
        .status(201)
        .json({ message: "Lead Added Successfully.", lead: saveLead });
    } else {
      res.status(400).json({ error: "Failed to Add Lead." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

app.get("/leads", async (req, res) => {
  try {
    const { salesAgent, status, tags, source } = req.query;
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
      filter.tags = { $all: tagArray }; // Matches leads that have all provided tags
    }

    const leads = await Lead.find().populate("salesAgent");
    if (leads.length > 0) {
      res.status(200).json(leads);
    } else {
      res.status(401).json({ error: "No leads Found!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/tags", async (req, res) => {
  try {
    const name = req.body;
    const newTag = new Tag({ name });
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
    if (saveTag) {
      res.status(201).json({ message: "Created Tag", tag: saveTag });
    } else {
      res.status(404).json({ error: "Failed to create Tag." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
