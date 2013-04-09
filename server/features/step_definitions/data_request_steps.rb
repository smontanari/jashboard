When /^I request all the dashboards$/ do
  get "/ajax/dashboards"
end

When /^I request the creation of a dashboard with name "(.*)"$/ do |name|
  post '/ajax/dashboard', %({"name": "#{name}"})
end

When /^I request the creation of a monitor for dashboard "(.*)" with (.*), (\d+), of type (.*), position (\d+),(\d+), size (\d+)x(\d+), configured as (.*)$/ do |dashboard_id, name, refresh_interval, type, top, left, width, height, configuration|
  request_body = %({
      "name": "#{name}",
      "refresh_interval": #{refresh_interval},
      "type": "#{type}", 
      "position": {"top": #{top}, "left": #{left}}, 
      "size": {"width": #{width}, "height": #{height}}, 
      "configuration": #{eval(configuration).to_json}})
  post "/ajax/dashboard/#{dashboard_id}/monitor", request_body
end

When /^I request the runtime info for monitor (\w+)$/ do |monitor_id|
  get "/ajax/monitor/#{monitor_id}/runtime"
end

When /^I request to update the configuration of monitor (\w+) with values (.+), (\d+), (.+) and (.+)$/ do |monitor_id, name, refresh_interval, type, configuration|
  request_body = %({
      "name": "#{name}",
      "refresh_interval": #{refresh_interval},
      "type": "#{type}", 
      "configuration": #{eval(configuration).to_json}})
  put "/ajax/monitor/#{monitor_id}/configuration", request_body
end

When /^I request to update the position of monitor (\w+) with coordinates (\d+), (\d+)$/ do |monitor_id, top, left|
  put "/ajax/monitor/#{monitor_id}/position", %({"top": #{top}, "left": #{left}}) 
end

When /^I request to update the size of monitor (\w+) with dimensions (\d+), (\d+)$/ do |monitor_id, width, height|
  put "/ajax/monitor/#{monitor_id}/size", %({"width": #{width}, "height": #{height}}) 
end

When /^I request the deletion of dashboard "(\w+)"$/ do |dashboard_id|
  delete "/ajax/dashboard/#{dashboard_id}"
end

When /^I request the deletion of monitor "(\w+)" in dashboard "(\w+)"$/ do |monitor_id, dashboard_id|
  delete "/ajax/dashboard/#{dashboard_id}/monitor/#{monitor_id}"
end

When /^I request to update the dashboard with id "(.+)" with name "(.+)"$/ do |id, name|
  @current_dashboard = Jashboard::Dashboard.new
  @current_dashboard.id = id
  @current_dashboard.name = name
  put "/ajax/dashboard/#{id}", %({"name":"#{name}"})
end
