import Express, { json } from "express"

import type { Request, Response } from "express"
import { candidateRouter } from "./routes/candidate-route/candidate-route"

const app = Express()
const port = 3000

app.use(json())
app.get("/", (req: Request, res: Response) => {
  res.send("server is running hello ")
})

app.use("/api/v1/candidate", candidateRouter)

app.listen(port, () => {
  console.log(`port is running on server ${port}`)
})
