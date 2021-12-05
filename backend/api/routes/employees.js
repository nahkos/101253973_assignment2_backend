const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Employee = require("../models/employee");
const port = process.env.PORT || 9090;

router.get("/api/v1/employees", (req, res, next) => {
  Employee.find()
    .select("firstName lastName emailId _id")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        employees: docs.map((doc) => {
          return {
            firstName: doc.firstName,
            lastName: doc.lastName,
            emailId: doc.emailId,
            _id: doc._id,
            request: {
              type: "GET",
              url: `http://localhost:${port}/api/v1/employees/` + doc._id,
            },
          };
        }),
      };
      if (docs.length >= 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "No entries found",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/api/v1/employees/:employeeId", (req, res, next) => {
  const id = req.params.employeeId;
  Employee.findById(id)
    .select("firstName lastName emailId _id")
    .exec()
    .then((doc) => {
        const response = {            
                firstName: doc.firstName,
                lastName: doc.lastName,
                emailId: doc.emailId,
                _id: doc._id,
                request: {
                  type: "GET",
                  url: `http://localhost:${port}/api/v1/employees/` + doc._id,
                },
              };        
      if (doc) {
        res.status(200).json(response);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.post("/api/v1/employees", (req, res, next) => {
  const employee = new Employee({
    _id: new mongoose.Types.ObjectId(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    emailId: req.body.emailId,
  });
  employee
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created employee successfully",
        createdEmployee: {
          firstName: result.firstName,
          lastName: result.lastName,
          emailId: result.emailId,
          _id: result._id,
          request: {
            type: "POST",
            url: `http://localhost:${port}/api/v1/employees/` + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.put("/api/v1/employees/:employeeId", (req, res, next) => {
  const id = req.params.employeeId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
  Employee.update({ _id: id }, { $set: {firstName: req.body.newFirst, lastName: req.body.newLast, emailId: req.body.newEmail} })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Updated employee successfully",
        request: {
            type: "PATCH",
            url: `http://localhost:${port}/api/v1/employees/` + id          
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/api/v1/employees/:employeeId", (req, res, next) => {
  const id = req.params.employeeId;
  Employee.remove({ _id: id })
    .exec()
    .then((result) => {
        // console.log(result);
      res.status(200).json({
        message: "Deleted employee successfully",           
        request: {
            type: "POST",
            url: `http://localhost:${port}/api/v1/employees/`,
            body: {firstName: 'String', lastName: 'String', emailId: 'String'}         
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
