import { NextResponse } from "next/server";
import pool from '../../../db'

//Handle POST requests to the ingredients route on the API
export async function POST(request: Request) {
    try{
        // Parse the request body
        const body = await request.json();
        //Destructure parsed body
        const {
            name,
            price,
            store,
            measurement_value,
            measurement_type,
            description
        } = body;

        //validate the incoming data
        if(!name || !price || !measurement_value || !measurement_type )  {
            return NextResponse.json({ error: 'Missing required fields'}, { status: 400})
        }

        //Establish a new database connection
        const client = await pool.connect();

        try{
            //check for unique ingredient name
            const checkExisting = await client.query(
                'SELECT * FROM ingredients WHERE LOWER(item_name) = LOWER($1)', 
                [name]
            );

            if (checkExisting.rows.length > 0) {
                return NextResponse.json({ 
                    error: 'That ingredient already exists! You can edit the ingredient below, but no duplicate ingredients please :)', 
                    isDuplicate: true,
                    existingItem: checkExisting.rows[0]
                }, {status: 409});
            }

            const currentDate = new Date().toISOString().split('T')[0];

            //Execute SQL query to enter new ingredient to the database
            const res = await client.query(
                'INSERT INTO ingredients (item_name, quantity, measurement_type, price, store, date_added, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [name, measurement_value, measurement_type, price, store, currentDate, description]
            );

            

            //Return the newly created ingredient info
            return NextResponse.json(
                {
                    id: res.rows[0].id,
                    item_name: res.rows[0].item_name,
                    message: 'Ingredient added successfully!'
                }, 
                { status: 201 }
            );
        } finally {
            //Release the client
            client.release();
        }
    } catch (error) {
        console.error('Error submitting ingredient:', error);
        
        return NextResponse.json({ error: 'Internal Server Error' }, {status: 500})
    }
}

//GET Endpoint to get all ingredients


export async function GET() {
    try{
        //Establish a new database connection
        const client = await pool.connect();

        try {
            const res = await client.query(
                'SELECT * FROM ingredients ORDER BY item_name'
            );
            return NextResponse.json(res.rows, { status: 200 });
        } finally {
            client.release();
        }
    } catch(error){
        console.error('Error getting ingredients:', error);
        return NextResponse.json({error: 'Failed getting ingredients'}, {status: 500})
    }
}