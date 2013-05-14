require 'spec_helper'
require 'open-uri'
require 'stringio'
require 'plugins/build/adapters/jenkins_adapter'

module Jashboard
  module Plugin
    module Build
      describe JenkinsAdapter do
        include Jashboard::RSpecHelper
        before(:each) do
          adapter_class = Class.new do
            include JenkinsAdapter
          end
          @adapter = adapter_class.new
        end

        context("Build runtime info retrieval") do
          LAST_BUILD_URL = "http://test.host:1234/job/test-build/lastCompletedBuild/api/xml"
          PROJECT_URL = "http://test.host:1234/job/test-build/api/xml"

          before(:each) do
            stub_http_response(PROJECT_URL) do
              File.new("spec/resources/plugins/build/jenkins-project-building-response.xml")
            end

            @configuration = {hostname: "test.host", port: 1234, type: "jenkins", build_id: "test-build"}.to_struct
          end

          it("should return last build information for a successful build") do
            stub_http_response(LAST_BUILD_URL) do
              File.new("spec/resources/plugins/build/jenkins-lastbuild-success-response.xml")
            end

            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            runtime_info.last_build_time.should == "2012-11-05 09:35:08 +1100"
            runtime_info.duration.should == 25
            runtime_info.success.should == true
          end
          it("should return last build information for a failed build") do
            stub_http_response(LAST_BUILD_URL) do
              File.new("spec/resources/plugins/build/jenkins-lastbuild-failure-response.xml")
            end

            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            runtime_info.success.should == false
          end
          it("should return current build status as 0 when last build number is same as last completed build") do
            stub_http_response(LAST_BUILD_URL) do
              File.new("spec/resources/plugins/build/jenkins-lastbuild-success-response.xml")
            end
            stub_http_response(PROJECT_URL) do
              File.new("spec/resources/plugins/build/jenkins-project-not-building-response.xml")
            end

            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            runtime_info.status.should == 0
          end
          it("should return current build status as 1 when requestinglast build number is greater than last completed build") do
            stub_http_response(LAST_BUILD_URL) do
              File.new("spec/resources/plugins/build/jenkins-lastbuild-success-response.xml")
            end
            stub_http_response(PROJECT_URL) do
              File.new("spec/resources/plugins/build/jenkins-project-building-response.xml")
            end

            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            runtime_info.status.should == 1
          end
          it("should return current build status as nil when requesting project info fails") do
            stub_http_response(LAST_BUILD_URL) do
              File.new("spec/resources/plugins/build/jenkins-lastbuild-success-response.xml")
            end
            stub_http_response(PROJECT_URL) do
              raise OpenURI::HTTPError.new("404", nil)
            end

            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            runtime_info.status.should be_nil
          end
        end
      end
    end
  end
end
