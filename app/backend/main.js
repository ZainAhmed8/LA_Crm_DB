// App config
const express = require('express')
var cors = require('cors');
const app = express();
const port = 3001;
const mysql = require('mysql2');
app.use(cors())

// App functions
function connect_db(cb) {
    const connection = mysql.createConnection({
        host: '35.193.54.140',
        user: 'root',
        password: '12345678',
        database: 'cs411'
    });
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        cb(connection);
    });
}

function getReport(query, cb) {
    if (query['Weapon'] !== undefined) { // handle weapon query
        connect_db((connection) => {
            connection.query(`select * from Report natural join Weapon natural join Premise where weapon_cd=${query['Weapon']} limit 1500`, (err, rows, fields) => {
                if (err) console.log(err);
                cb(rows);
                connection.close();
            })
        })
    } else if (query['User'] !== undefined) {
        connect_db((connection) => {
            connection.query(`select * from Report natural join Weapon natural join Premise natural join Status natural join Crime where user_id='${query['User']}' limit 1500`, (err, rows, fields) => {
                if (err) console.log(err);
                cb(rows);
                connection.close();
            })
        })
    } else { // default get all
        connect_db((connection) => {
            connection.query(`select * from Report natural join Weapon natural join Premise natural join Status natural join Crime limit 1500`, (err, rows, fields) => {
                if (err) console.log(err);
                cb(rows);
                connection.close();
            })
        })
    }
}

function getWeapons(cb) {
    connect_db((connection) => {
        connection.query(`select * from Weapon`, (err, rows, fields) => {
            if (err) console.log(err);
            cb(rows);
            connection.close();
        })
    })
}

function getCrimes(cb) {
    connect_db((connection) => {
        connection.query(`select * from Crime`, (err, rows, fields) => {
            if (err) console.log(err);
            cb(rows);
            connection.close();
        })
    })
}

function getStatuses(cb) {
    connect_db((connection) => {
        connection.query(`select * from Status`, (err, rows, fields) => {
            if (err) console.log(err);
            cb(rows);
            connection.close();
        })
    })
}

function getDescents(cb) {
    connect_db((connection) => {
        connection.query(`select distinct vict_descent from Report`, (err, rows, fields) => {
            if (err) console.log(err);
            cb(rows);
            connection.close();
        })
    })
}

function getPremises(cb) {
    connect_db((connection) => {
        connection.query(`select * from Premise`, (err, rows, fields) => {
            if (err) console.log(err);
            cb(rows);
            connection.close();
        })
    })
}

function signup(username, password, cb) {
    connect_db((connection) => {
        connection.query(`insert into User (user_id,password) values ('${username}','${password}')`, (err, rows, fields) => {
            if (err) {
                console.log(err);
                cb('Please pick a different username. Username already exists.');
            } else {
                cb('Sign up successful');
            }
            connection.close();
        })
    })
}

function login(username, password, cb) {
    connect_db((connection) => {
        connection.query(`select password from User where user_id = '${username}'`, (err, rows, fields) => {
            if (err) {
                console.log(err);
                cb('Username and password not found.');
                connection.close();
                return;
            }
            if (rows && rows.length && rows[0].password == password) {
                cb('Login successful');
            } else {
                cb('Username and password not found.');
            }
            connection.close();
        })
    })
}

function getAutocompleteCrmSuggestions(query, cb) {
    connect_db((connection) => {
        connection.query(`select crm_desc from Crime where crm_desc like "${query}%"`, (err, rows, fields) => {
            if (err) console.log(err);
            // console.log(rows);
            cb(rows);
        })
    })
}

function report(record_no, crime, age, sex, descent, weapon, premise, location, user_id, status, cb) {
    nextRecordNo((rec) => {
        const record_no = rec[0]['MAX(record_no)'] + 1;
        console.log(record_no)
        connect_db((connection) => {
            connection.query(`insert into Report (record_no, crm_cd, vict_age,  vict_sex, vict_descent, weapon_cd, premise_cd, location, user_id, status_cd) values ('${record_no}','${crime}', '${age}', '${sex}', '${descent}', '${weapon}', '${premise}', '${location}', '${user_id}', '${status}')`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb('Successfully reported crime.');
                } else {
                    cb('Error reporting crime');
                }
                connection.close();
            })
        })
    })
}

function updateReport(record_no, crime, age, sex, descent, weapon, premise, location, status, cb) {
    connect_db((connection) => {
        if (crime) {
            connection.query(`update Report set crm_cd = '${crime}' where record_no=${record_no}`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(['err update']);
                } else {
                    cb(['success update']);
                }
                connection.close();
            })
        }
        if (age) {
            connection.query(`update Report set vict_age = '${age}' where record_no=${record_no}`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(['err update']);
                } else {
                    cb(['success update']);
                }
                connection.close();
            })
        }
        if (sex) {
            connection.query(`update Report set vict_sex = '${sex}' where record_no=${record_no}`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(['err update']);
                } else {
                    cb(['success update']);
                }
                connection.close();
            })
        }
        if (descent) {
            connection.query(`update Report set vict_descent = '${descent}' where record_no=${record_no}`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(['err update']);
                } else {
                    cb(['success update']);
                }
                connection.close();
            })
        }
        if (weapon) {
            connection.query(`update Report set weapon_cd = '${weapon}' where record_no=${record_no}`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(['err update']);
                } else {
                    cb(['success update']);
                }
                connection.close();
            })
        }
        if (premise) {
            connection.query(`update Report set premise_cd = '${premise}' where record_no=${record_no}`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(['err update']);
                } else {
                    cb(['success update']);
                }
                connection.close();
            })
        }
        if (location) {
            connection.query(`update Report set location = '${location}' where record_no=${record_no}`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(['err update']);
                } else {
                    cb(['success update']);
                }
                connection.close();
            })
        }
        if (status) {
            connection.query(`update Report set status_cd = '${status}' where record_no=${record_no}`, (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    cb(['err update']);
                } else {
                    cb(['success update']);
                }
                connection.close();
            })
        }
    })
}

function nextRecordNo(cb) {

    connect_db((connection) => {
        connection.query(`select MAX(record_no) from Report`, (err, rows, fields) => {
            if (err) console.log(err);
            cb(rows);
            connection.close();
        })
    })
}

function quickCompare(dist1, dist2, cb) {
    connect_db((connection) => {

        connection.query(`CALL CompareDists(${dist1}, ${dist2});`, (err, rows, fields) => {
            if (err) console.log(err);
            cb(rows);
            connection.close();
        })
    })
}

function getDistInfo(dist1, dist2, crm_desc, cb) {
    connect_db((connection) => {

        connection.query(`select * from Report natural join Crime where (dist_no='${dist1}' or dist_no='${dist2}') and crm_desc='${crm_desc}' limit 1500`, (err, rows, fields) => {
            if (err) console.log(err);
            cb(rows);
            connection.close();
        })
    })
}

function delReport(record_no, cb) {
    connect_db((connection) => {
        connection.query(`delete from Report where record_no = '${record_no}'`, (err, rows, fields) => {
            if (err) {
                console.log(err);
                cb('Error deleting report');
            } else {
                cb('Successfully deleted report.');
            }
            connection.close();
        })
    })
}

function getRecordNo(user_id, cb) {
    connect_db((connection) => {
        connection.query(`select record_no from Report where user_id = '${user_id}'`, (err, rows, fields) => {
            if (err) {
                console.log(err);
                cb(['Error deleting record']);
            } else {
                cb(rows);
            }
            connection.close();
        })
    })
}

// REST API endpoints
app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/autocompleteCrm', (req, res) => {
    const query = req.query;
    // console.log(query);
    const search = query.search;
    getAutocompleteCrmSuggestions(search, (suggestions) => {
        res.send(suggestions);
    });
})

app.get('/quickCompare', (req, res) => {
    const query = req.query;
    const dist1 = query.dist1;
    const dist2 = query.dist2;
    quickCompare(dist1, dist2, (resp) => {
        res.send(resp);
    });
});

app.get('/getCmpInfo', (req, res) => {
    const query = req.query;
    const dist1 = query.dist1;
    const dist2 = query.dist2;
    const crm_desc = query.crm_desc;
    getDistInfo(dist1, dist2, crm_desc, (resp) => {
        res.send(resp);
    });
});

app.get('/nextRecordNo', (req, res) => {
    nextRecordNo((resp) => {
        res.send(resp);
    })
})

app.get('/getWeapons', (req, res) => {
    getWeapons((resp) => {
        res.send(resp);
    })
})
app.get('/getCrimes', (req, res) => {
    getCrimes((resp) => {
        res.send(resp);
    })
})
app.get('/getDescents', (req, res) => {
    getDescents((resp) => {
        res.send(resp);
    })
})
app.get('/getPremises', (req, res) => {
    getPremises((resp) => {
        res.send(resp);
    })
})

app.get('/getStatuses', (req, res) => {
    getStatuses((resp) => {
        res.send(resp);
    })
})

app.get('/report', (req, res) => {
    const record_no = req.query.record_no;
    const crime = req.query.crime;
    const age = req.query.age;
    const sex = req.query.sex;
    const descent = req.query.descent;
    const weapon = req.query.weapon;
    const premise = req.query.premise;
    const location = req.query.location;
    const user_id = req.query.user_id;
    const status = req.query.status;

    report(null, crime, age, sex, descent, weapon, premise, location, user_id, status, (resp) => {
        res.send(resp);
    })
})

app.get('/updateReport', (req, res) => {
    const record_no = req.query.record_no;
    const crime = req.query.crime;
    const age = req.query.age;
    const sex = req.query.sex;
    const descent = req.query.descent;
    const weapon = req.query.weapon;
    const premise = req.query.premise;
    const location = req.query.location;
    const status = req.query.status;

    updateReport(record_no, crime, age, sex, descent, weapon, premise, location, status, (resp) => {
        res.send(resp);
    })
})

app.get('/delreport', (req, res) => {
    const record_no = req.query.record_no;

    delReport(record_no, (resp) => {
        res.send(resp);
    })
})

app.get('/getrecordno', (req, res) => {
    const user_id = req.query.user_id;

    getRecordNo(user_id, (resp) => {
        res.send(resp);
    })
})

app.get('/login', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    login(username, password, (resp) => {
        res.send(resp);
    })
})

app.get('/signup', (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    signup(username, password, (resp) => {
        res.send(resp);
    })
})

app.get('/getReport', (req, res) => {
    const query = req.query;
    getReport(query, (data) => {
        res.send(data);
    })
})

app.get('/getWeapons', (req, res) => {
    getWeapons((data) => {
        res.send(data);
    })
})

// launch app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})