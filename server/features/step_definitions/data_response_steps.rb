Then /^the app should return the json response "(.*)"$/ do |fixture_path|
  last_response.should be_ok
  File.open("#{$JSON_FIXTURE_PATH}/#{fixture_path}") do |f|
    last_response.body.should be_json_eql f.read
  end
end

Then /^the app should return a response containing an empty dashboard with name "(.*)" and an id$/ do |name|
  response = JSON.parse(last_response.body)
  response['id'].should_not be_empty
  response['name'].should == name
  response['monitors'].should be_empty
end
