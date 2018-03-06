console.info("Main script started");
var BODY = "body";

function resolve(i, n, t) {
    chrome['storage']['sync'].get(i, function (l) {
        jQuery.isEmptyObject(l) ? t && t(i) : (console.info("Found name " + l[i] + " for user " + i), n(l[i]))
    })
}

function all(i) {
    function n(i) {
        resolve(i.attr("href").replace("/", ""), function (n) {
            i.html(n)
        })
    }

    function t(i) {
        withChildren(i, "div#pv_box", function (i) {
            withChildren(i, "div#pv_narrow", function (i) {
                withDetected(i, "div.pv_author_block", function (i) {
                    withChildren(i, "a.mem_link", function (i) {
                        n(i)
                    })
                }), withDetected(i, "div#pv_comments", function (i) {
                    withChildren(i, "div#pv_comments_list", function (i) {
                        withAll(i, "div._post", function (i) {
                            withChildren(i, "a.author", function (i) {
                                n(i)
                            })
                        })
                    })
                })
            })
        })
    }

    function l(i, t) {
        withAll(i, t, function (i) {
            n(i)
        })
    }

    function o(i) {
        withAll(i, "div.module_body", function (i) {
            withAll(i, "div.people_cell_name", function (i) {
                withAll(i, "a", function (i) {
                    n(i)
                })
            })
        })
    }

    withAll(i, "div#list_content", function (i) {
        withAll(i, "div", function (i) {
            withAll(i, "div.friends_user_row", function (i) {
                var n, t, l;
                t = "id" + (n = i).attr("id").replace("friends_user_row", ""), (l = n.find("div.friends_field_title a")).attr("id", "callback" + t), resolve(t, function (i) {
                    l.html(i)
                }),
                    function (i) {
                        var n = new jQuery.Deferred;
                        withChildren($(document), "div#side_bar li#l_ph a", function (i) {
                            n.resolve(i.attr("href").replace("/albums", ""))
                        });
                        var t = new jQuery.Deferred;
                        withChildren(i, "img.friends_photo_img", function (i) {
                            t.resolve(i.attr("src"))
                        });
                        var l = new jQuery.Deferred,
                            o = new jQuery.Deferred;
                        withChildren(i, "div.friends_field_title a", function (i) {
                            l.resolve(i.html()), o.resolve(i.attr("href").replace("/", ""))
                        });
                        var e = new jQuery.Deferred;
                        withChildren($(document), "div#page_header_wrap a#top_back_link", function (i) {
                            e.resolve(i.attr("href").replace("/", ""))
                        });
                        var r = "id" + i.attr("id").replace("friends_user_row", "");
                        withChildren(i, "a.friends_field_act", function (a) {
                            i.find(".vkr_rename").length || $.when(n, e, o, t, l).done(function (i, n, t, l, o) {
                                console.debug("Rendering for: " + i + " " + n + " " + t + " " + o + " " + l), load("rename_action", "html/rename_action.html", function (e) {
                                    $(Mustache.render(e, {
                                        ownId: i,
                                        targetId: r,
                                        ownId: i,
                                        ownAlias: n,
                                        targetAlias: t,
                                        avatar: l,
                                        name: o
                                    })).insertBefore(a)
                                })
                            })
                        })
                    }(i)
            })
        })
    }), withAll(i, "div#feed_rows", function (i) {
        withAll(i, "div.feed_row", function (i) {
            withAll(i, "div", function (i) {
                l(i, "a.author"), l(i, "a.copy_author")
            }), l(i, "a.author"), l(i, "a.copy_author")
        }), withAll(i, "div.feed_row", function (i) {
            l(i, "a.author"), l(i, "a.copy_author")
        })
    }), withAll(i, "ul#im_dialogs", function (i) {
        withAll(i, "li.nim-dialog", function (i) {
            var n;
            n = i, withAll(n, "a._im_peer_target", function (i) {
                resolve(i.attr("href").replace("/", ""), function (i) {
                    withAll(n, "span._im_dialog_name span", function (n) {
                        n.html(i)
                    })
                })
            })
        })
    }), withAll(i, "div._im_peer_history", function (i) {
        withAll(i, "div._im_mess_stack", function (i) {
            var t;
            t = i, withAll(t, "a.im-mess-stack--lnk", function (i) {
                n(i)
            }), withAll(t, "a.copy_author", function (i) {
                n(i)
            })
        })
    }), withAll(i, "div#photos_container_photos", function (i) {
        withAll(i, "div._post", function (i) {
            withAll(i, "a.author", function (i) {
                n(i)
            })
        })
    }), withAll($("div#layer_wrap"), "div.pv_cont", function (i) {
        t(i)
    }), withAll(i, "div#layer_wrap", function (i) {
        withAll(i, "div.pv_cont", function (i) {
            t(i)
        })
    }), withAll(i, "div#mv_layer_wrap", function (i) {
        withAll(i, "div#mv_box", function (i) {
            withAll(i, "div#mv_info", function (i) {
                withAll(i, "div.mv_info_wide_column", function (i) {
                    withAll(i, "div.mv_author_name", function (i) {
                        withAll(i, "a.mem_link", function (i) {
                            resolve(i.attr("href").replace("/videos", ""), function (n) {
                                i.html(n)
                            })
                        })
                    }), withAll(i, "div#mv_comments", function (i) {
                        withAll(i, "div._post", function (i) {
                            withAll(i, "a.author", function (i) {
                                n(i)
                            })
                        })
                    })
                })
            })
        })
    }), withAll(i, "div#likes_posts", function (i) {
        withAll(i, "div#results", function (i) {
            withAll(i, "div.wall_posts", function (i) {
                withAll(i, "div._post", function (i) {
                    withAll(i, "a.author", function (i) {
                        n(i)
                    })
                })
            })
        })
    }), withAll(i, "div#users", function (i) {
        withAll(i, "div#users_content", function (i) {
            withAll(i, "div.fans_fan_row", function (i) {
                withAll(i, "div.fans_fan_name", function (i) {
                    withAll(i, "a.fans_fan_lnk", function (i) {
                        n(i)
                    })
                })
            })
        })
    }), withAll(i, "div.wide_column_right", function (i) {
        withAll(i, "div.narrow_column_wrap", function (n) {
            withAll(n, "div#page_avatar", function (n) {
                withAll(n, "a#profile_photo_link", function (n) {
                    var t = n.attr("href").replace("/photo", ""),
                        l = "id" + t.substr(0, t.indexOf("_"));
                    withAll(i, "div#page_info_wrap", function (i) {
                        withAll(i, "h2.page_name", function (i) {
                            resolve(l, function (n) {
                                i.html(n)
                            })
                        })
                    })
                })
            })
        })
    }), withAll(i, "div.narrow_column_wrap", function (i) {
        withAll(i, "div#narrow_column", function (i) {
            withAll(i, "div.page_block", function (i) {
                withAll(i, "div#profile_friends", function (i) {
                    o(i)
                }), withAll(i, "div#profile_friends_online", function (i) {
                    o(i)
                })
            })
        })
    }), withAll(i, "div#page_info_wrap", function (i) {
        withAll(i, "div.profile_info_block", function (i) {
            withAll(i, "a.mem_link", function (i) {
                n(i)
            })
        })
    }), withAll(i, "div#profile_wall", function (i) {
        withAll(i, "div#page_wall_posts", function (i) {
            withAll(i, "div._post", function (i) {
                withAll(i, "div", function (i) {
                    l(i, "a.author"), l(i, "a.copy_author")
                })
            })
        })
    })
}

all($(BODY)), withAll($(BODY), "div#wrap2", function (i) {
    all($(BODY))
}), console.info("Main script finished");