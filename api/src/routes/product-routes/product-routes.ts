import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Product List");
});

router.get("/:id", (req, res) => {
    console.log(req.params);
    res.send('A product');
})

module.exports = router; 