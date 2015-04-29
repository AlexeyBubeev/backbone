$(function() {

    // Departments Model
    var departmentsModel = Backbone.Model.extend({
        urlRoot: '/api/getDepartments.php',
        defaults: {
            name: "",
            id: ""
        },
        toString: function(){return this.get('name');}
    });
    // Department Collection
    var departmentsCollection = Backbone.Collection.extend({
        model: departmentsModel,
        url: '/api/getDepartments.php',
    });

    // User Model
    var userModel = Backbone.Model.extend({
        urlRoot: "/api/saveUser.php",
        schema: {
            fname: {
                title: 'Имя',
                validators: ['required']
            },
            lname: {
                title: 'Фамилия',
                validators: ['required']
            },
            mname: {
                title: 'Отчество',
                validators: ['required']
            },
            department_id: {
                title: 'Отдел',
                type: 'Select',
                options: new departmentsCollection()
            },
            job: {
                title: 'Должность',
                validators: ['required']
            },
            birthday: {
                title: 'Дата рождения',
                type: 'Date'
            },
            birthplace: {
                title: 'Место рождения',
                validators: ['required']
            }
        }
    });


    var myuserModel = new userModel();
    var myform = new Backbone.Form({
        template: _.template($('#formTemplate').html()),
        model: myuserModel
    }).render();

    $('body').append(myform.el);

    myform.on('submit', function(event) {
        event.preventDefault();
        var errs = myform.validate();
        if (errs) {
            event.preventDefault()
        } else {
            var data = Backbone.Syphon.serialize(this);
            this.model.set(data);
            this.model.save();
            alert('Пользотель успешно добавлен');
            myuserCollection.fetch();
        };
    });

    var usersTableView = Backbone.View.extend({
        collection: null,
        el: $('#usesrs tbody'),
        initialize: function(options) {
            this.collection = options.collection;
            _.bindAll(this, 'render');
            this.collection.bind('reset', this.render);
            this.collection.bind('add', this.render);
            this.collection.bind('remove', this.render);
        },
        render: function() {
        this.$el.empty();
            _.each(this.collection.models, function(data) {
                this.$el.append(new userRowView({ model: data}).render().el);
            }, this);
            return this;
        }
    });

    var userRowView = Backbone.View.extend({
        tagName: "tr",
        template: _.template($("#usersTemplate").html()),
        events : {
            "click .delete" : "deleteUser"
        },
        initialize: function(options) {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
        },
        render: function() {
        //    console.log('render');
            this.$el.html( this.template(this.model.toJSON()) );
            return this;
        },
        deleteUser : function(e) {
            e.preventDefault();
            var cid = $(e.target).attr('value');
            var person = this.model;
            if (confirm("Удалить пользователя из базы?"))
                person.destroy({
                    success: function(removed_person, data) {
                    },
                    error: function(aborted_person, response) {
                    alert("Ошибка");
                    }
            });
        }
    });

    var userModel = Backbone.Model.extend({
        urlRoot: "/api/getUsers.php",
        defaults: {
            id: 0,
            first_name: '',
            last_name: '',
            middle_name: '',
            department_name: '',
            job: '',
            birthday: '',
            birthplace: ''
        },
        destroy: function (options) {
            var opts = _.extend({url: '/api/removeUser.php?remove_user_by_id=' + this.id}, options || {});
            return Backbone.Model.prototype.destroy.call(this, opts);
        }
    });

    var userCollection = Backbone.Collection.extend({
        model : userModel,
        url : "/api/getUsers.php"
    });

    var myuserCollection = new userCollection();
    var myusersTableView = new usersTableView({collection:myuserCollection}).render();
    myuserCollection.fetch();

});
