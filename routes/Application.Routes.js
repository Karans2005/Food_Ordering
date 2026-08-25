const express = require("express");
const ApplicationModel = require("../model/Application.Model.js");
const authMiddleware = require("../middleware/authMiddleware.js");

console.log("ApplicationModel type:", typeof ApplicationModel);
console.log(
  "ApplicationModel.findOne:",
  typeof ApplicationModel.findOne
);

const router = express.Router();

// ==================== CREATE APPLICATION ====================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      jobId,
      providerId,
      proposedPrice,
      message,
    } = req.body;

    // JWT se logged-in user ki ID
    const applicantId = req.user.userId;

    if (!jobId || !providerId) {
      return res.status(400).send({
        status: 0,
        msg: "jobId and providerId are required",
      });
    }

    const existingApplication =
      await ApplicationModel.findOne({
        jobId,
        providerId,
        applicantId,
      });

    if (existingApplication) {
      return res.status(400).send({
        status: 0,
        msg: "Application already exists",
      });
    }

    const application = new ApplicationModel({
      jobId,
      providerId,
      applicantId,
      proposedPrice,
      message: message || "",
    });

    await application.save();

    res.status(201).send({
      status: 1,
      msg: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to submit application",
      error: error.message,
    });
  }
});

// ==================== GET ALL APPLICATIONS ====================

router.get("/", async (req, res) => {
  try {
    const applications = await ApplicationModel.find()
      .populate("jobId")
      .populate("providerId")
      .populate(
        "applicantId",
        "firstName lastName email phone"
      )
      .sort({ createdAt: -1 });

    res.send({
      status: 1,
      msg: "Applications fetched successfully",
      applications,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch applications",
      error: error.message,
    });
  }
});

// ==================== GET SINGLE APPLICATION ====================

router.get("/:id", async (req, res) => {
  try {
    const application =
      await ApplicationModel.findById(req.params.id)
        .populate("jobId")
        .populate("providerId")
        .populate(
          "applicantId",
          "firstName lastName email phone"
        );

    if (!application) {
      return res.status(404).send({
        status: 0,
        msg: "Application not found",
      });
    }

    res.send({
      status: 1,
      application,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch application",
      error: error.message,
    });
  }
});

// ==================== UPDATE APPLICATION STATUS ====================

router.put("/:id", async (req, res) => {
  try {
    const {
      status,
      proposedPrice,
      message,
    } = req.body;

    const updateData = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (proposedPrice !== undefined) {
      updateData.proposedPrice = proposedPrice;
    }

    if (message !== undefined) {
      updateData.message = message;
    }

    const application =
      await ApplicationModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!application) {
      return res.status(404).send({
        status: 0,
        msg: "Application not found",
      });
    }

    res.send({
      status: 1,
      msg: "Application updated successfully",
      application,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to update application",
      error: error.message,
    });
  }
});

// ==================== DELETE APPLICATION ====================

router.delete("/:id", async (req, res) => {
  try {
    const application =
      await ApplicationModel.findByIdAndDelete(
        req.params.id
      );

    if (!application) {
      return res.status(404).send({
        status: 0,
        msg: "Application not found",
      });
    }

    res.send({
      status: 1,
      msg: "Application deleted successfully",
      deletedApplication: application,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to delete application",
      error: error.message,
    });
  }
});

module.exports = router;


// const express = require("express");
// const ApplicationModel = require("../model/Application.Model.js");
// const authMiddleware = require("../middleware/authMiddleware.js");

// const router = express.Router();

// // ======================================================
// // CREATE APPLICATION
// // ======================================================

// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const {
//       jobId,
//       providerId,
//       proposedPrice,
//       message,
//     } = req.body;

//     const applicantId = req.user.userId;

//     if (!jobId || !providerId) {
//       return res.status(400).send({
//         status: 0,
//         msg: "jobId and providerId are required",
//       });
//     }

//     const existingApplication =
//       await ApplicationModel.findOne({
//         jobId,
//         providerId,
//         applicantId,
//       });

//     if (existingApplication) {
//       return res.status(400).send({
//         status: 0,
//         msg: "Application already exists",
//       });
//     }

//     const application = new ApplicationModel({
//       jobId,
//       providerId,
//       applicantId,
//       proposedPrice,
//       message: message || "",
//     });

//     await application.save();

//     res.status(201).send({
//       status: 1,
//       msg: "Application submitted successfully",
//       application,
//     });
//   } catch (error) {
//     console.error("CREATE APPLICATION ERROR:", error);

//     res.status(500).send({
//       status: 0,
//       msg: "Failed to submit application",
//       error: error.message,
//     });
//   }
// });

// // ======================================================
// // GET ALL APPLICATIONS
// // ======================================================

// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const applications =
//       await ApplicationModel.find()
//         .populate("jobId")
//         .populate("providerId")
//         .populate(
//           "applicantId",
//           "firstName lastName email phone"
//         )
//         .sort({ createdAt: -1 });

//     res.send({
//       status: 1,
//       msg: "Applications fetched successfully",
//       applications,
//     });
//   } catch (error) {
//     console.error("GET APPLICATIONS ERROR:", error);

//     res.status(500).send({
//       status: 0,
//       msg: "Failed to fetch applications",
//       error: error.message,
//     });
//   }
// });

// // ======================================================
// // GET SINGLE APPLICATION
// // ======================================================

// router.get("/:id", authMiddleware, async (req, res) => {
//   try {
//     const application =
//       await ApplicationModel.findById(req.params.id)
//         .populate("jobId")
//         .populate("providerId")
//         .populate(
//           "applicantId",
//           "firstName lastName email phone"
//         );

//     if (!application) {
//       return res.status(404).send({
//         status: 0,
//         msg: "Application not found",
//       });
//     }

//     res.send({
//       status: 1,
//       application,
//     });
//   } catch (error) {
//     console.error("GET SINGLE APPLICATION ERROR:", error);

//     res.status(500).send({
//       status: 0,
//       msg: "Failed to fetch application",
//       error: error.message,
//     });
//   }
// });

// // ======================================================
// // UPDATE APPLICATION STATUS
// // ======================================================

// router.put("/:id", authMiddleware, async (req, res) => {
//   try {
//     const { status, proposedPrice, message } = req.body;

//     console.log("====================================");
//     console.log("UPDATE APPLICATION");
//     console.log("Application ID:", req.params.id);
//     console.log("User ID:", req.user.userId);
//     console.log("New Status:", status);
//     console.log("====================================");

//     // --------------------------------------------------
//     // VALIDATE STATUS
//     // --------------------------------------------------

//     const allowedStatuses = [
//       "pending",
//       "accepted",
//       "rejected",
//       "completed",
//     ];

//     if (
//       status !== undefined &&
//       !allowedStatuses.includes(status)
//     ) {
//       return res.status(400).send({
//         status: 0,
//         msg: "Invalid application status",
//       });
//     }

//     // --------------------------------------------------
//     // FIND APPLICATION
//     // --------------------------------------------------

//     const application =
//       await ApplicationModel.findById(req.params.id);

//     if (!application) {
//       return res.status(404).send({
//         status: 0,
//         msg: "Application not found",
//       });
//     }

//     // --------------------------------------------------
//     // UPDATE
//     // --------------------------------------------------

//     if (status !== undefined) {
//       application.status = status;
//     }

//     if (proposedPrice !== undefined) {
//       application.proposedPrice = proposedPrice;
//     }

//     if (message !== undefined) {
//       application.message = message;
//     }

//     await application.save();

//     // --------------------------------------------------
//     // RETURN UPDATED APPLICATION
//     // --------------------------------------------------

//     const updatedApplication =
//       await ApplicationModel.findById(application._id)
//         .populate("jobId")
//         .populate("providerId")
//         .populate(
//           "applicantId",
//           "firstName lastName email phone"
//         );

//     console.log(
//       "✅ APPLICATION UPDATED:",
//       updatedApplication._id,
//       updatedApplication.status
//     );

//     return res.status(200).send({
//       status: 1,
//       msg: "Application updated successfully",
//       application: updatedApplication,
//     });
//   } catch (error) {
//     console.error("UPDATE APPLICATION ERROR:", error);

//     return res.status(500).send({
//       status: 0,
//       msg: "Failed to update application",
//       error: error.message,
//     });
//   }
// });

// // ======================================================
// // DELETE APPLICATION
// // ======================================================

// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     const application =
//       await ApplicationModel.findByIdAndDelete(
//         req.params.id
//       );

//     if (!application) {
//       return res.status(404).send({
//         status: 0,
//         msg: "Application not found",
//       });
//     }

//     res.send({
//       status: 1,
//       msg: "Application deleted successfully",
//       deletedApplication: application,
//     });
//   } catch (error) {
//     console.error("DELETE APPLICATION ERROR:", error);

//     res.status(500).send({
//       status: 0,
//       msg: "Failed to delete application",
//       error: error.message,
//     });
//   }
// });

// module.exports = router;