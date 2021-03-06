from django.conf.urls import patterns, include, url
from managementconsole import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^injectFacter/$', views.injectFacter, name='injectFacter'),
    url(r'^resource/dummyEndpoint/(?P<option>[-\w]+)/$', views.dummyEndpoint, name='dummyEndpoint'),
    url(r'^resource/listTables/$', views.listTables, name='listTables'),
    url(r'^resource/storeCollectedData/$', views.storeCollectedData, name='storeCollectedData'),
    url(r'^resource/getLoginHistory/$', views.getLoginHistory, name='getLoginHistory'),
    url(r'^resource/getFacter/$', views.getFacter, name='getFacter'),
    url(r'^resource/getMemory/$', views.getMemory, name='getMemory'),
    url(r'^resource/getMostVisistedDomains/$', views.getMostVisistedDomains, name='getMostVisistedDomains'),
    url(r'^resource/getAllDomains/$', views.getAllDomains, name='getAllDomains'),
    url(r'^resource/getDomainInfo/$', views.getDomainInfo, name='getDomainInfo'),
    url(r'^resource/getUpdatesConnectorsCount/$', views.getUpdatesConnectorsCount, name='getUpdatesConnectorsCount'),
    url(r'^resource/getAvailableUpdates/$', views.getAvailableUpdates, name='getAvailableUpdates'),
    url(r'^resource/getTenants/$', views.getTenants, name='getTenants'),
    url(r'^resource/getVolatileFacts/$', views.getVolatileFacts, name='getVolatileFacts'),
    url(r'^resource/getNonvolatileTimeline/$', views.getNonvolatileTimeline, name='getNonvolatileTimeline'),
)

