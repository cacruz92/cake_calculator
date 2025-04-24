import { NextResponse } from "next/server";
import pool from '../../../db'

//Handle POST requests to the recipes route on the API
export async function POST(request: Request) {
    try{
        // Parse the request body
        const body = await request.json();
        //Destructure parsed body
        const {
            recipe_name,
            instructions,
            ingredients
        } = body;

        //validate the incoming data
        if(!recipe_name || !instructions || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0)  {
            return NextResponse.json({ error: 'Missing required fields or no ingredients listed'}, { status: 400})
        }

        //Establish a new database connection
        const client = await pool.connect();

        try{

            await client.query('BEGIN');
            
            const currentDate = new Date().toISOString().split('T')[0];

            //Execute SQL query to enter new recipe to the recipe table
            const recipeResult = await client.query(
                'INSERT INTO recipes (recipe_name, instructions, date_created) VALUES ($1, $2, $3) RETURNING *', [recipe_name, instructions, currentDate]
            );

            const recipeId = recipeResult.rows[0].recipe_id;

            // SQL query to enter the igredients into recipe_items table row by row
            for(const ingredient of ingredients){
                await client.query(
                    'INSERT INTO recipe_items (recipe_id, ingredient_id, quantity, measurement_type, price) VALUES ($1, $2, $3, $4, $5)', [recipeId, ingredient.inventory_id, ingredient.quantity, ingredient.measurement_type, ingredient.price]
                )
            }

            //Add up all the costs
            const totalCost = ingredients.reduce((sum, ingredient) => sum + Number(ingredient.price), 0);
            
            //add the total cost to the recipes table
            await client.query(
                'UPDATE recipes SET total_cost = $1 WHERE recipe_id = $2',
                [totalCost, recipeId]
            )

            //If everything is correct commit the changes made to the different tables
            await client.query('COMMIT');
                        

            //Return the newly created recipe info
            return NextResponse.json(
                {
                    id: recipeId,
                    recipe_name: recipe_name,
                    message: 'Recipe added successfully!'
                }, 
                { status: 201 }
            );
        } catch(error){
            //If there is an error, undo all changes
            await client.query('ROLLBACK');
            throw error;
        }finally {
            //Release the client
            client.release();
        }
    } catch (error) {
        console.error('Error submitting recipe:', error);
        
        return NextResponse.json({ error: 'Internal Server Error' }, {status: 500})
    }
}

//GET Endpoint to get all recipes


