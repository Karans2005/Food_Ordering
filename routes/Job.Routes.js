// const express = require("express");
// const JobModel = require("../model/Job.Model.js");

// const router = express.Router();

// // ==================== CREATE JOB ====================

// router.post("/", async (req, res) => {
//   try {
//     const {
//       title,
//       service,
//       location,
//       description,
//       budgetMin,
//       budgetMax,
//       jobImage,
//       postedBy,
//     } = req.body;

//     if (
//       !title ||
//       !service ||
//       !location ||
//       !description ||
//       budgetMin === undefined ||
//       budgetMax === undefined ||
//       !postedBy
//     ) {
//       return res.status(400).send({
//         status: 0,
//         msg: "All required job fields are required",
//       });
//     }

//     if (Number(budgetMin) > Number(budgetMax)) {
//       return res.status(400).send({
//         status: 0,
//         msg: "budgetMin cannot be greater than budgetMax",
//       });
//     }

//     const job = new JobModel({
//       title,
//       service,
//       location,
//       description,
//       budgetMin,
//       budgetMax,
//       jobImage: jobImage || "",
//       postedBy,
//     });

//     await job.save();

//     res.status(201).send({
//       status: 1,
//       msg: "Job posted successfully",
//       job,
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: 0,
//       msg: "Failed to post job",
//       error: error.message,
//     });
//   }
// });

// // ==================== GET ALL OPEN JOBS ====================

// router.get("/", async (req, res) => {
//   try {
//     const jobs = await JobModel.find()
//       .populate(
//         "postedBy",
//         "firstName lastName email phone"
//       )
//       .sort({ createdAt: -1 });

//     res.send({
//       status: 1,
//       msg: "Jobs fetched successfully",
//       jobs,
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: 0,
//       msg: "Failed to fetch jobs",
//       error: error.message,
//     });
//   }
// });

// // ==================== GET SINGLE JOB ====================

// router.get("/:id", async (req, res) => {
//   try {
//     const job = await JobModel.findById(
//       req.params.id
//     ).populate(
//       "postedBy",
//       "firstName lastName email phone"
//     );

//     if (!job) {
//       return res.status(404).send({
//         status: 0,
//         msg: "Job not found",
//       });
//     }

//     res.send({
//       status: 1,
//       job,
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: 0,
//       msg: "Failed to fetch job",
//       error: error.message,
//     });
//   }
// });

// // ==================== UPDATE JOB ====================

// router.put("/:id", async (req, res) => {
//   try {
//     const {
//       title,
//       service,
//       location,
//       description,
//       budgetMin,
//       budgetMax,
//       jobImage,
//       status,
//     } = req.body;

//     const updateData = {};

//     if (title !== undefined) updateData.title = title;
//     if (service !== undefined) updateData.service = service;
//     if (location !== undefined) updateData.location = location;
//     if (description !== undefined) {
//       updateData.description = description;
//     }

//     if (budgetMin !== undefined) {
//       updateData.budgetMin = budgetMin;
//     }

//     if (budgetMax !== undefined) {
//       updateData.budgetMax = budgetMax;
//     }

//     if (jobImage !== undefined) {
//       updateData.jobImage = jobImage;
//     }

//     if (status !== undefined) {
//       updateData.status = status;
//     }

//     if (
//       updateData.budgetMin !== undefined &&
//       updateData.budgetMax !== undefined &&
//       Number(updateData.budgetMin) >
//         Number(updateData.budgetMax)
//     ) {
//       return res.status(400).send({
//         status: 0,
//         msg: "budgetMin cannot be greater than budgetMax",
//       });
//     }

//     const job = await JobModel.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!job) {
//       return res.status(404).send({
//         status: 0,
//         msg: "Job not found",
//       });
//     }

//     res.send({
//       status: 1,
//       msg: "Job updated successfully",
//       job,
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: 0,
//       msg: "Failed to update job",
//       error: error.message,
//     });
//   }
// });

// // ==================== DELETE JOB ====================

// router.delete("/:id", async (req, res) => {
//   try {
//     const job = await JobModel.findByIdAndDelete(
//       req.params.id
//     );

//     if (!job) {
//       return res.status(404).send({
//         status: 0,
//         msg: "Job not found",
//       });
//     }

//     res.send({
//       status: 1,
//       msg: "Job deleted successfully",
//       deletedJob: job,
//     });
//   } catch (error) {
//     res.status(500).send({
//       status: 0,
//       msg: "Failed to delete job",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;

//CONVERT CHANGE JWT 

const express = require("express");
const JobModel = require("../model/Job.Model.js");

const router = express.Router();

// ==================== CREATE JOB ====================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      service,
      location,
      description,
      budgetMin,
      budgetMax,
      jobImage,
    } = req.body;

    if (
      !title ||
      !service ||
      !location ||
      !description ||
      budgetMin === undefined ||
      budgetMax === undefined
    ) {
      return res.status(400).send({
        status: 0,
        msg: "All required job fields are required",
      });
    }

    if (Number(budgetMin) > Number(budgetMax)) {
      return res.status(400).send({
        status: 0,
        msg: "budgetMin cannot be greater than budgetMax",
      });
    }

    const job = new JobModel({
      title,
      service,
      location,
      description,
      budgetMin,
      budgetMax,
      jobImage: jobImage || "",

      // JWT se logged-in user ki ID
      postedBy: req.user.userId,
    });

    await job.save();

    res.status(201).send({
      status: 1,
      msg: "Job posted successfully",
      job,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to post job",
      error: error.message,
    });
  }
});

// ==================== GET ALL JOBS ====================

router.get("/", async (req, res) => {
  try {
    const jobs = await JobModel.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.send({
      status: 1,
      msg: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch jobs",
      error: error.message,
    });
  }
});

// ==================== GET SINGLE JOB ====================

router.get("/:id", async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!job) {
      return res.status(404).send({
        status: 0,
        msg: "Job not found",
      });
    }

    res.send({
      status: 1,
      job,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch job",
      error: error.message,
    });
  }
});

// ==================== UPDATE JOB ====================

router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      service,
      location,
      description,
      budgetMin,
      budgetMax,
      jobImage,
      status,
    } = req.body;

    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (service !== undefined) updateData.service = service;
    if (location !== undefined) updateData.location = location;
    if (description !== undefined) {
      updateData.description = description;
    }
    if (budgetMin !== undefined) {
      updateData.budgetMin = budgetMin;
    }
    if (budgetMax !== undefined) {
      updateData.budgetMax = budgetMax;
    }
    if (jobImage !== undefined) {
      updateData.jobImage = jobImage;
    }
    if (status !== undefined) {
      updateData.status = status;
    }

    if (
      updateData.budgetMin !== undefined &&
      updateData.budgetMax !== undefined &&
      Number(updateData.budgetMin) >
        Number(updateData.budgetMax)
    ) {
      return res.status(400).send({
        status: 0,
        msg: "budgetMin cannot be greater than budgetMax",
      });
    }

    const job = await JobModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).send({
        status: 0,
        msg: "Job not found",
      });
    }

    res.send({
      status: 1,
      msg: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to update job",
      error: error.message,
    });
  }
});

// ==================== DELETE JOB ====================

router.delete("/:id", async (req, res) => {
  try {
    const job = await JobModel.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).send({
        status: 0,
        msg: "Job not found",
      });
    }

    res.send({
      status: 1,
      msg: "Job deleted successfully",
      deletedJob: job,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to delete job",
      error: error.message,
    });
  }
});

module.exports = router;