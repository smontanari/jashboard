Then /^the dashboard should be saved in the repository$/ do
  response = JSON.parse(last_response.body)

  @db_helper.validate_dashboard(response['id']) do |dashboard|
    dashboard.should_not be_nil
    dashboard.name.should == response['name']
  end
end

Then /^monitor (\w+) position should have coordinates updated to (\d+), (\d+)$/ do |monitor_id, top, left|
  @db_helper.validate_monitor(monitor_id) do |monitor|
    monitor.position.top.should == top.to_i
    monitor.position.left.should == left.to_i
  end
end