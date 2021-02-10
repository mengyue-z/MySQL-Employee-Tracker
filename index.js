const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table')

const connection = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'password',
    database: 'employee_db',
});

connection.connect((err) => {
    if (err) throw err;
    start();
});

const start = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'View employees by manager',
                'Add departments',
                'Add roles',
                'Add employees',
                'Update employee managers',
                'Delete departments',
                'Delete roles',
                'Delete employees',
                'View the total utilized budget of a department'
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewDepartments();
                    break;

                case 'View all roles':
                    viewRoles();
                    break;

                case 'View all employees':
                    viewEmployees();
                    break;

                case 'View employees by manager':
                    viewEmployeesbyManager();
                    break;

                case 'Add departments':
                    addDepts();
                    break;

                case 'Add roles':
                    addRoles();
                    break;

                case 'Add employees':
                    addEmployees();
                    break;

                case 'Update employee managers':
                    updateManager();
                    break;

                case 'Delete departments':
                    deleteDepts();
                    break;

                case 'Delete roles':
                    deleteRoles();
                    break;

                case 'Delete employees':
                    deleteEmployees();
                    break;
                case 'View the total utilized budget of a department':
                    viewBudget();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
};

const viewDepartments = () => {
    const query = 'SELECT * FROM departments'
    connection.query(query, (err, res) => {
        console.table(res);
    })
    start();
}

const viewRoles = () => {
    const query = 'SELECT * FROM roles'
    connection.query(query, (err, res) => {
        console.table(res);
    })
    start();
}

const viewEmployees = () => {
    const query = 'SELECT * FROM employees'
    connection.query(query, (err, res) => {
        console.table(res);
    })
    start();
}

// const viewEmployeesbyManager = () => {
//     const query = 'SELECT * FROM employee_db.employees'
//     connection.query(query, (err, results) => {
//         if (err) throw err;
//         inquirer
//             .prompt([
//                 {
//                     name: 'choice',
//                     type: 'rawlist',
//                     choices() {
//                         const employeeArray = [];
//                         results.forEach(({ first_name, last_name }) => {
//                             employeeArray.push(first_name, last_name);
//                         });
//                         return employeeArray;
//                     },
//                     message: 'View employees by which manager?',
//                 },
//             ])
//             .then((answer) => {
//                 console.log(answer.choices)
//             })
//         })
//         start();
// }

const addDepts = () => {
    inquirer
      .prompt([
        {
          name: 'newDept',
          type: 'input',
          message: 'What department do you want to add?',
        },
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO departments (department) VALUES (?)',
         [answer.newDept],
          (err) => {
            if (err) throw err;
            console.log('New department was created successfully!');
            start();
          }
        );
      });
  };
  
  const addRoles = () => {
    inquirer
      .prompt([
        {
          name: 'newRole',
          type: 'input',
          message: 'What role do you want to add?',
        },
        {
          name: 'newSalary',
          type: 'input',
          message: 'What is the salary for this new role?',
        }
      ])
      .then((answer) => {
        connection.query(
          'INSERT INTO roles SET ?',
          {
            title: answer.newRole,
            salary: answer.newSalary,
          },
          (err) => {
            if (err) throw err;
            console.log('New department was created successfully!');
            start();
          }
        );
      });
  };


