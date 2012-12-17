When /^I request all the dashboard$/ do
  get "/ajax/dashboards"
end

When /^I request the creation of a dashboard with name "(.*)"$/ do |name|
  request_body = "{\"name\":\"#{name}\"}"
  post '/ajax/dashboard', request_body
end
