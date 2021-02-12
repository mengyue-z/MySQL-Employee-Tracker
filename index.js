const mysql = require('mysql');
const inquirer = require('inquirer');

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
        'View all employees',
        'View all departments',
        'View all roles',
        'View employees by manager',
        'Add departments',
        'Add roles',
        'Add employees',
        'Update employee roles',
        'Update employee managers',
        'Delete departments',
        'Delete roles',
        'Delete employees',
        'Exit'
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
        case 'Update employee roles':
          updateRoles();
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
        case 'Exit':
          connection.end();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const viewEmployees = () => {
  const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) as manager 
  FROM employees 
  LEFT JOIN roles ON roles.id = employees.role_id
  LEFT JOIN employees manager on manager.id = employees.manager_id
  LEFT JOIN departments on departments.id = roles.department_id`
  connection.query(query, (err, res) => {
    console.table(res);
    start();
  })
}

const viewRoles = () => {
  const query = 'SELECT * FROM roles'
  connection.query(query, (err, res) => {
    console.table(res);
    start();
  })
}

const viewDepartments = () => {
  const query = 'SELECT * FROM departments'
  connection.query(query, (err, res) => {
    console.table(res);
    start();
  })
}

const viewEmployeesbyManager = () => {
  const query = 'SELECT * FROM employees'
  connection.query(query, (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'choice',
          type: 'rawlist',
          choices() {
            const employeeArray = [];
            results.forEach(({ first_name, last_name, id }) => {
              employeeArray.push({ name: `${first_name} ${last_name}`, value: `${id}` });
            });
            return employeeArray;
          },
          message: 'View employees by which manager?',
        },
      ])
      .then((answer) => {
        connection.query('SELECT * FROM employees WHERE manager_id = ?', [answer.choice],
          (err, res) => {

            console.table(res);
            start();
          })
      })
  })
}

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
  connection.query('SELECT * FROM departments', (err, results) => {
    if (err) throw err;
    let deptArray = [];
    results.forEach(({ department, id }) => {
      deptArray.push({ name: `${department}`, value: `${id}` });
    });
    inquirer
      .prompt([
        {
          name: 'newRole',
          type: 'input',
          message: 'What role do you want to add?',
        },
        {
          name: 'roleDept',
          type: 'rawlist',
          choices: deptArray,
          message: 'Which deparment does this role belongs to?',
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
            department_id: answer.roleDept
          },
          (err) => {
            if (err) throw err;
            console.log('New role was created successfully!');
            start();
          }
        );
      });
  })
};

const addEmployees = () => {
  connection.query('SELECT * FROM roles', (err, results) => {
    if (err) throw err;
    let roleArray = [];
    results.forEach(({ title, id }) => {
      roleArray.push({ name: `${title}`, value: `${id}` });
    });
    inquirer
      .prompt([
        {
          name: 'newFirstName',
          type: 'input',
          message: "What is the new employee's first name?",
        },
        {
          name: 'newLastName',
          type: 'input',
          message: "What is the new employee's last name?",
        },
        {
          name: 'newRole',
          type: 'rawlist',
          choices: roleArray,
          message: "What is the new employee's role?",
        }
      ])
      .then((answer) => {
            connection.query(
              'INSERT INTO employees SET ?',
              {
                first_name: answer.newFirstName,
                last_name: answer.newLastName,
                role_id: answer.newRole,
              },
              (err) => {
                if (err) throw err;
                console.log('New employee was added successfully!');
                start();
              }
            );
          });
        })
}
const updateRoles = () => {
  connection.query('SELECT roles.title, employees.role_id, employees.first_name, employees.last_name, roles.id FROM roles LEFT JOIN employees ON roles.id = employees.id', (err, results) => {
    if (err) throw err;
    let roleArray = [];
    let employeeArray = [];
    results.forEach(({ title, role_id }) => {
      roleArray.push({ name: `${title}`, value: `${role_id}` });
    });
    results.forEach(({ first_name, last_name, id }) => {
      employeeArray.push({ name: `${first_name} ${last_name}`, value: `${id}` });
    });
    inquirer
      .prompt([
        {
          name: 'employeeUpdate',
          type: 'rawlist',
          choices: employeeArray,
          message: "Who do you want to update?"
        },
        {
          name: 'selectedRole',
          type: 'rawlist',
          choices: roleArray,
          message: "What is this employee's new role?",
        }
      ])
      .then((answer) => {
        console.log(answer.selectedRole)
        connection.query(
          'UPDATE employees SET ? WHERE ?',
          [
            {
              id: answer.employeeUpdate,
            },
            {
              role_id: answer.selectedRole,
            },
          ],
            
              console.log("You have successfully updated the employee's role!"));
              start();
        
          

      })
  })
}

  const updateManager = () => {
    const query = 'SELECT * FROM employees'
    connection.query(query, (err, results) => {
      if (err) throw err;
      let employeeArray = [];
      results.forEach(({ first_name, last_name, id }) => {
        employeeArray.push({ name: `${first_name} ${last_name}`, value: `${id}` });
      });

      inquirer
        .prompt([
          {
            name: 'selectedEmployee',
            type: 'list',
            choices: employeeArray,
            message: "Who do you want to assign a new manager?"
          },
          {
            name: 'selectedManager',
            type: 'rawlist',
            choices: employeeArray,
            message: "Who is this employee's new manager?",
          }
        ])
        .then((answer) => {
          connection.query(
            'UPDATE employees SET ? WHERE ?',
            [
              {
                manager_id: answer.selectedManager
              },
              {
                id: answer.selectedEmployee,
              },
            ],
            (error) => {
              if (error) throw err;
              else {
                console.log('Your have successfully updated the manager');
                start();
              }

            })
        })
    })
  }

  const deleteDepts = () => {
    const query = 'SELECT * FROM departments'
    connection.query(query, (err, results) => {
      if (err) throw err;
      let deptArray = [];
      results.forEach(({ department }) => {
        deptArray.push({name:`${department}` });
      });
    inquirer
      .prompt([
        {
          name: 'deletedDept',
          type: 'rawlist',
          choices: deptArray,
          message: 'Which department do you want to delete?',
        },
      ])
      .then((answer) => {
        connection.query(
          'DELETE FROM departments WHERE department = ?',
          [answer.deletedDept],
          (err) => {
            if (err) throw err;
            console.log('Department was deleted successfully!');
            start();
          }
        );
      });
    })
  };

  const deleteRoles = () => {
    const query = 'SELECT * FROM roles'
    connection.query(query, (err, results) => {
      if (err) throw err;
      let roleArray = [];
      results.forEach(({ title }) => {
        roleArray.push({name:`${title}` });
      });
    inquirer
      .prompt([
        {
          name: 'deletedRole',
          type: 'rawlist',
          choices: roleArray,
          message: 'Which role do you want to delete?',
        },
      ])
      .then((answer) => {
        connection.query(
          'DELETE FROM roles WHERE title = ?',
          [answer.deletedRole],
          (err) => {
            if (err) throw err;
            console.log('Role was deleted successfully!');
            start();
          }
        );
      });
    })
  };

  const deleteEmployees = () => {
    const query = 'SELECT * FROM employees'
    connection.query(query, (err, results) => {
    inquirer
      .prompt([
        {
          name: 'deletedEmployee',
          type: 'rawlist',
          choices() {
            const employeeArray = [];
            results.forEach(({ first_name, last_name, id }) => {
              employeeArray.push({ name: `${first_name} ${last_name}`, value: `${id}` });
            });
            return employeeArray;
          },
          message: 'Who do you want to delete?',
        },
      ])
      .then((answer) => {
        connection.query(
          'DELETE FROM employees WHERE id = ?',
          [answer.deletedEmployee],
          (err) => {
            if (err) throw err;
            console.log('Employee was deleted successfully!');
            start();
          }
        );
      });
    })
  };
