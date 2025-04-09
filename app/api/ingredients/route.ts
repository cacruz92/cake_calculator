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

        //Execute SQL query to enter new ingredient to the database
        const res = await client.query(
            'INSERT INTO ingredients (name, price, store, measurement_value, measurement_type, description) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, price, store, measurement_value, measurement_type, description]
        );

        //Release the client
        client.release();

        //Return the newly created ingredient info
        return NextResponse.json(
            {
                ingredient_id: res.rows[0].ingredient_id,
                name: res.rows[0].name,
                message: 'Ingredient added successfully!'
            }, 
            { status: 201 }
        );

    } catch (error) {
        console.error('Error submitting ingredient:', error);
        
        return NextResponse.json({ error: 'Internal Server Error' }, {status: 500})
    }
}