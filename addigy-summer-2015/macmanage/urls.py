from django.conf.urls import patterns, include, url
from managementconsole import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^resource/dummyEndpoint/(?P<option>[-\w]+)/$', views.dummyEndpoint, name='dummyEndpoint'),
    url(r'^resource/listTables/$', views.listTables, name='listTables'),
    url(r'^resource/storeCollectedData/$', views.storeCollectedData, name='storeCollectedData'),
    url(r'^resource/getHistory/$', views.getHistory, name='getHistory'),
)

