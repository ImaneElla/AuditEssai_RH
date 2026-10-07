/**
 * @swagger
 * /api/evaluation-details/{id}:
 * get:
 * summary: Get evaluation-details by ID
 * tags:
 * - evaluation-details
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: OK
 */
export async function GET(req:Request,{params}:{params:{id:string}}){return Response.json({id:params.id})}
