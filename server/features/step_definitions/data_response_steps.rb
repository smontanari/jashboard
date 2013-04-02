Then /^the app should return the json response "(.*)"$/ do |fixture_path|
  last_response.should be_ok
  File.open("#{$JSON_FIXTURE_PATH}/#{fixture_path}") do |f|
    last_response.body.should be_json_eql f.read
  end
end

Then /^the app should return the error response "(.*)"$/ do |reponse_text|
  last_response.status.should == 500
  last_response.body.should == reponse_text
end

Then /^the app should return a json response matching '(.*)'$/ do |regexp|
  last_response.status.should == 200
  match = Regexp.new(regexp).match(last_response.body)
  match.should_not be_nil
end

Then /^the app should return a response containing an empty dashboard with name "(.*)" and an id$/ do |name|
  last_response.status.should == 201
  response = JSON.parse(last_response.body)
  response['id'].should_not be_empty
  response['name'].should == name
  response['monitors'].should be_empty
  @current_dashboard = Jashboard::Dashboard.new
  @current_dashboard.id = response['id']
  @current_dashboard.name = response['name']
end

Then /^the app should return a response containing a new monitor with name (.*), refresh interval (.*), type (.*) and an id$/ do |name, refresh_interval, type|
  last_response.status.should == 201
  response = JSON.parse(last_response.body)
  response['id'].should_not be_empty
  response['name'].should == name
  response['refresh_interval'].should == refresh_interval.to_i
  response['type'].should == type
end

Then /^the app should return a response containing a dashboard with id "(.*?)", and monitors$/ do |id, expected_monitors|
  last_response.should be_ok
  dashboards = JSON.parse(last_response.body)
  dashboards.first['id'].should == id
  actual_monitors = dashboards.first['monitors']
  actual_monitors.size.should == expected_monitors.rows.size
  expected_monitors.hashes.each_with_index do |monitor, index|
    actual_monitors[index]['name'].should == monitor[:name]
    actual_monitors[index]['refresh_interval'].should == monitor[:refresh_interval].to_i
    actual_monitors[index]['type'].should == monitor[:type]
  end
end

Then /^the app should return a successful response$/ do
  last_response.should be_ok
end

Then /^the app should return a successful response without content$/ do
  last_response.status.should == 204
end
