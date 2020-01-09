const http=require('http')
const http2=require('http2')

const express=require('express')
const pug=require('pug')
const chalk=require('chalk')
const dotenv=require('dotenv')

const path=require('path')
const fs=require('fs')

dotenv.config()

const database=require('./core/database')
const errorhandler=require('./core/errorhandler')
const logger=require('./core/logger')
const bodyParser=require('./core/body-parser')

vision =class
{
    constructor()
    {
        try
        {
            const app=new express()
            const db=new database()
			const handler=new errorhandler()
            const log=new logger()
            const parser=new bodyParser()
            /*
            * Error Handler
            */
            handler.set(app,(error,flag)=>
            {
                if(error)
                    throw ({errorhandler:error})
                console.log("%s  %s  %s",flag?chalk.green('✅'):chalk.red('❎'),chalk.yellow('[APP]'),chalk.blue('Error Handler is'+(flag?'':' not')+' active'))
            })
            /*
            * Morgan Loger
            */
			log.set(app,(error,flag)=>
            {
                if(error)
                    throw ({logger:error})
                console.log("%s  %s  %s",flag?chalk.green('✅'):chalk.red('❎'),chalk.yellow('[APP]'),chalk.blue('Morgan Loger is'+(flag?'':' not')+' active'))
            })
             /*
            * Body Parser
            */
            parser.set(app,(error,flag)=>
            {
                if(error)
                    throw ({logger:error})
                console.log("%s  %s  %s",flag?chalk.green('✅'):chalk.red('❎'),chalk.yellow('[APP]'),chalk.blue('Body Parser is'+(flag?'':' not')+' active'))
            })
            /*
            * Mongoose Connect
            */
            db.set((error,flag)=>
            {
                if(error)
                    throw ({database:error})
                console.log("%s  %s  %s",flag?chalk.green('✅'):chalk.red('❎'),chalk.yellow('[APP]'),chalk.blue('Database connection is'+(flag?'':' not')+' active'))
            })
            //
            app.all('*',(req,res)=>
            {
                res.status(200).json({status:'this is a test'})
			})
			//
			app.listen(process.env.HTTP_PORT)
        }
        catch(error)
        {
            console.log(error)
        }
    }
}

new vision()