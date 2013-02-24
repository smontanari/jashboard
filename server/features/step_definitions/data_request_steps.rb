When /^I request all the dashboards$/ do
  get "/ajax/dashboards"
end

When /^I request the creation of a dashboard with name "(.*)"$/ do |name|
  request_body = "{\"name\":\"#{name}\"}"
  post '/ajax/dashboard', request_body
end

When /^I request the creation of a monitor for dashboard "(.*)" with (.*), (\d+), of type (.*), configured as (.*)$/ do |dashboard_id, name, refresh_interval, type, config|
  request_body = "{\"name\": \"#{name}\", \"refresh_interval\": #{refresh_interval}, \"type\": \"#{type}\", \"configuration\": #{eval(config).to_json}}"
  post "/ajax/dashboard/#{dashboard_id}/monitor", request_body
end

When /^I request the runtime info for monitor (\w+)$/ do |monitor_id|
  get "/ajax/monitor/#{monitor_id}/runtime"
end
