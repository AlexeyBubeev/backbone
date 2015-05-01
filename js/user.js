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


    var DepsModel = Backbone.Model.extend({
        urlRoot: '/api/getDepartments.php',
        defaults: {
            name: "",
            id: ""
        },
    });

    var mydepsModel = new DepsModel();

    var DepsCollection = Backbone.Collection.extend({
        model: DepsModel,
        url: '/api/getDepartments.php',
    });
    var mydepsCollection = new DepsCollection();
    var DepsView = Backbone.View.extend({
        bindings: {
            '#filterorderselect': {
                observe: 'filterorderselect',
                selectOptions: {
                collection: mydepsCollection,
                labelPath: 'name',
                valuePath: 'id',
                    defaultOption: {
                        label: 'Все отделы',
                        value: 0
                    }
                }
            }
        },
        render: function () {
            this.stickit();
        }
    });
    var depView = new DepsView({
        model: mydepsModel,
        el: 'body'
    });

    $.when(departmentsCollection).then(function() {
        mydepsCollection.fetch();
        depView.render();

    });

    $('body').append(myform.el);

    // Form Save
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
        el: $('#usesrs'),
        events: {
            "change #filterorderselect" : "sorts",
            "keyup .filteruser" : "search",

        },
        initialize: function(options) {
            this.collection = options.collection;
            _.bindAll(this, 'render','search','sorts');
            this.collection.bind('reset', this.render);
            this.collection.bind('add', this.render);
            this.collection.bind('remove', this.render);
        },
        render: function() {
            this.$el.find('tbody').empty();
            _.each(this.collection.models, function(data) {
                this.$el.append(new userRowView({ model: data}).render().el);
            }, this);
            return this;
        },
        renderList : function(tasks){
            this.$el.find('tbody').empty();
            _.each(tasks.models, function(data) {
                this.$el.append(new userRowView({ model: data }).render().el);
            }, this);
            tasks = null;
            return this;
        },
        search: function(e){
            var letters = $(e.target).val();
            var name = $(e.target).attr('title');
            $("#filterorderselect").val('0');
            $(".filteruser").not(e.target).val("");
            this.renderList(this.collection.search(letters,name));
        },
        sorts: function(e){
            var status = $("#filterorderselect").find("option:selected").val();
            if(status == "") status = 0;
            this.renderList(this.collection.currentStatus(status));
        }
    });


    var userRowView = Backbone.View.extend({
        events: {
            "click .delete" : "deleteUser"
        },
        tagName: "tr",
        template: _.template($("#usersTemplate").html()),
        initialize: function(options) {
            _.bindAll(this, 'render');
            this.model.bind('change', this.render);
        },
        render: function() {
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
            birthplace: '',
            dep_id: 0
        },
        destroy: function (options) {
            var opts = _.extend({url: '/api/removeUser.php?remove_user_by_id=' + this.id}, options || {});
            return Backbone.Model.prototype.destroy.call(this, opts);
        }
    });

    var userCollection = Backbone.Collection.extend({
        model : userModel,
        url : "/api/getUsers.php",
        currentStatus : function(status){
            var filtered = this.filter(function(data) {
                if(status == 0) return true;
                return data.get("dep_id") == status;
            });
            return new userCollection(filtered);
        },
        search : function(letters,name){
            letters = letters.toString().toLowerCase();
            var filtered = this.filter(function(data) {
                if(letters.length == 0) return true;
                col_name = data.get(name).toString();
                return col_name.toLowerCase().indexOf(letters) >= 0;
            });
            return new userCollection(filtered);
        }
    });

    var myuserCollection = new userCollection();
    var myusersTableView = new usersTableView({collection:myuserCollection}).render();
    myuserCollection.fetch();

});
