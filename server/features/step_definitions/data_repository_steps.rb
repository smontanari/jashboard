Then /^the dashboard should be saved in the repository$/ do
  @db_helper.validate_dashboard(@current_dashboard.id) do |dashboard|
    dashboard.name.should == @current_dashboard.name
  end
end

Then /^monitor (\w+) position should have coordinates updated to (\d+), (\d+)$/ do |monitor_id, top, left|
  @db_helper.validate_monitor(monitor_id) do |monitor|
    monitor.position.top.should == top.to_i
    monitor.position.left.should == left.to_i
  end
end

Then /^monitor (\w+) size should have dimensions updated to (\d+), (\d+)$/ do |monitor_id, width, height|
  @db_helper.validate_monitor(monitor_id) do |monitor|
    monitor.size.width.should == width.to_i
    monitor.size.height.should == height.to_i
  end
end

Then /^dashboard "(\w+)" should be removed from the repository$/ do |dashboard_id|
  @db_helper.find_dashboard(dashboard_id).should be_nil
end

Then /^monitor "(\w+)" should be removed from the repository$/ do |monitor_id|
  @db_helper.find_monitor(monitor_id).should be_nil
end

Then /^dashboard "(\w+)" should contain monitors "(.*?)"$/ do |dashboard_id, monitors|
  @db_helper.validate_dashboard(dashboard_id) do |dashboard|
    monitors = monitors.split(',')
    dashboard.monitor_ids.length.should == monitors.length
    monitors.each do |monitor_id|
      dashboard.monitor_ids.should include(monitor_id)
    end
  end
end