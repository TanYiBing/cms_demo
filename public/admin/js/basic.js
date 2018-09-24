const app = {
    toggle: function (el, collectionName, attr, id) {
        //console.log(el,action,id);
        $.get('/admin/changeStatus', { collectionName: collectionName, attr: attr, id: id }, function (data) {
            if (data.success) {
                if (el.src.indexOf('yes') != -1) {
                    el.src = '/public/admin/images/no.gif';
                } else {
                    el.src = '/public/admin/images/yes.gif';
                }
            }
        })
    },
    confirmDelete() {
        $('.delete').click(function () {
            var flag = confirm('您确定要删除吗？');
            return flag;
        })
    }
}

$(function () {
    app.confirmDelete();
})