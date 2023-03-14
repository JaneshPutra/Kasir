const express = require ("express")
const router = express.Router()
const db = require("./db")
const multer = require("multer")// untuk mengunggah file
const path = require("path") // untuk memanggil path direktori
const fs = require("fs") // untuk manajemen file

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // set file storage
        cb(null, './image');
    },
    filename: (req, file, cb) => {
        // generate file name 
        cb(null, "hooh - "+ Date.now() + path.extname(file.originalname))
    }
})

let upload = multer({storage: storage})

// end-point menyimpan data siswa
router.post("/menu", upload.single("foto_menu") , (req, res) => {

    // prepare data
    let data = {
        nama_menu: req.body.nama_menu,
        kategori: req.body.kategori,
        harga_menu: req.body.harga_menu,
        stok: req.body.stok,
        foto_menu: req.file.filename
    }

    if (!req.file) {
        // jika tidak ada file yang diupload
        res.json({
            message: "Tidak ada file yang dikirim"
        })
    } else {
        // create sql insert
        let sql = "insert into pelanggaran set ?"

        // run query
        db.query(sql, data, (error, result) => {
            if(error) throw error
            res.json({
                message: result.affectedRows + " data berhasil disimpan"
            })
        })
    }
})

router.get("/menu", (req, res) => {
    // create sql query
    let sql = "select * from menu"

    // run query
    db.query(sql, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                menu: result // isi data
            }
        }
        res.json(response) // send response
    })
})

// end-point akses data siswa berdasarkan id_siswa tertentu
router.get("/menu/:id", (req, res) => {
    let data = {
        id_menu: req.params.id
    }
    // create sql query
    let sql = "select * from menu where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message // pesan error
            }
        } else {
            response = {
                count: result.length, // jumlah data
                menu: result // isi data
            }
        }
        res.json(response) // send response
    })
})



// end-point mengubah data siswa
router.put("/menu", (req, res) => {

    // prepare data
    let data = [
        // data
        {
            nama_menu: req.body.nama_menu,
            kategori: req.body.kategori,
            harga_menu: req.body.harga_menu,
            stok: req.body.stok
        },

        // parameter (primary key)
        {
            id_menu: req.body.id_menu
        }
    ]

    // create sql query update
    let sql = "update menu set ? where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data updated"
            }
        }
        res.json(response) // send response
    })
})

// end-point menghapus data siswa berdasarkan id_siswa
router.delete("/menu/:id", (req, res) => {
    // prepare data
    let data = {
        id_menu: req.params.id_menu
    }

    // create query sql delete
    let sql = "delete from kasir where ?"

    // run query
    db.query(sql, data, (error, result) => {
        let response = null
        if (error) {
            response = {
                message: error.message
            }
        } else {
            response = {
                message: result.affectedRows + " data deleted"
            }
        }
        res.json(response) // send response
    })
})
module.exports = router