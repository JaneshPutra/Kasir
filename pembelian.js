const express = require ("express")
const router = express.Router()
const db = require("./db")
const moment = require("moment")


router.post("/transaksi", (req, res) => {
    // prepare data to pelanggaran_siswa
    let data = {
        id_kasir: req.body.id_kasir,
        id_pelanggan: req.body.id_pelanggan,
        tgl_transaksi : moment().format('YYYY-MM-DD HH:mm:ss')
    }

    // parse to JSON
    let menu = JSON.parse(req.body.menu)

    // create query insert to pelanggaran_siswa
    let sql = "insert into transaksi set ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        

        if(error){
            res.json({message: error.message})
        } else {

            // get last inserted id_pelanggaran
            let lastID = result.insertId

            // prepare data to detail_pelanggaran
            let data = []
            for (let index = 0; index < menu.length; index++) {
                data.push([
                    lastID, menu[index].id_menu
                ])
            }

            // create query insert detail_pelanggaran
            let sql = "insert into detail_transaksi values ?"

            db.query(sql, [data], (error, result ) => {
                if(error){
                    res.json({message: error.message})
                } else {
                    res.json({message: "Data has been inserted"})
                }
            })
        }
    })
})

// end-point menampilkan data pelanggaran siswa
router.get("/transaksi", (req,res) => {
    // create sql query
    let sql = "select transaksi.id_transaksi, transaksi.id_kasir, transaksi.id_pelanggan, transaksi.tgl_transaksi, pelanggan.id_pelanggan, pelanggan.nama_pelanggan, kasir.id_kasir, kasir.nama_kasir, kasir.status_kasir from transaksi join pelanggan on transaksi.id_pelanggan = pelanggan.id_pelanggan join kasir on transaksi.id_kasir = kasir.id_kasir"
    // run query
    db.query(sql, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                pelanggaran_siswa: result
            })
        }
    })
})

// end-point untuk menampilkan detail pelanggaran
router.get("/transaksi/:id_transaksi", (req,res) => {
    let param = { id_transaksi: req.params.id_transaksi}

    // create sql query
    let sql = "select detail_transaksi.id_menu, detail_transaksi.id_transaksi, menu.id_menu, menu.nama_menu, menu.kategori, menu.harga_menu, menu.stok, menu.foto_menu from detail_transaksi join menu on detail_transaksi.id_menu = menu.id_menu "
    

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})   
        }else{
            res.json({
                count: result.length,
                detail_transaksi: result
            })
        }
    })
})

router.delete("/transaksi/:id_transaksi", (req, res) => {
    let param = { id_transaksi: req.params.id_transaksi}

    // create sql query delete detail_pelanggaran
    let sql = "delete from detail_transaksi where ?"

    db.query(sql, param, (error, result) => {
        if (error) {
            res.json({ message: error.message})
        } else {
            let param = { id_transaksi: req.params.id_transaksi}
            // create sql query delete pelanggaran_siswa
            let sql = "delete from transaksi where ?"

            db.query(sql, param, (error, result) => {
                if (error) {
                    res.json({ message: error.message})
                } else {
                    res.json({message: "Data has been deleted"})
                }
            })
        }
    })

})
    
module.exports = router