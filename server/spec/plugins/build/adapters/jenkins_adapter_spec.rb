require 'spec_helper'
require 'open-uri'
require 'stringio'
require 'plugins/build/adapters/jenkins_adapter'

module Jashboard
  module Plugin
    module Build
      describe JenkinsAdapter do
        before(:each) do
          adapter_class = Class.new do
            include JenkinsAdapter
          end
          @adapter = adapter_class.new
        end

        context("Build runtime info retrieval") do
          before(:each) do
            @next_build_uri = double("next_build_uri")
            @uri = double("uri")
            @uri.stub(:open) do
              File.new("spec/resources/jenkins-lastbuild-success-response.xml")
            end

            URI.should_receive(:parse).with("http://test.host:1234/job/test-build/lastSuccessfulBuild/api/xml").and_return(@uri)
            URI.should_receive(:parse).with("http://test.host:1234/job/test-build/7/api/xml").and_return(@next_build_uri)

            @configuration = {hostname: "test.host", port: 1234, type: "jenkins", build_id: "test-build"}.to_struct
          end

          it("should invoke the correct url to retrieve last build information") do
            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            expected_time = Time.parse("05-11-2012 09:35:08 +1100").strftime("%d-%m-%Y %H:%M:%S")
            runtime_info.last_build_time.should == expected_time
            runtime_info.duration.should == 25
            runtime_info.success.should == true
          end
          it("should return current build status as 0 when requesting next build info returns an HTTP 404") do
            @next_build_uri.stub(:open) do
              raise OpenURI::HTTPError.new("404 Not Found", StringIO.new)
            end

            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            runtime_info.status.should == 0
          end
          it("should return current build status as 1 when requesting next build info returns data") do
            @next_build_uri.stub(:open) do
              StringIO.new "<test></test>"
            end

            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            runtime_info.status.should == 1
          end
          it("should return current build status as nil when requesting next build info fails") do
            @next_build_uri.stub(:open) do
              raise "Generic Error"
            end

            runtime_info = @adapter.get_jenkins_runtime_info(@configuration)

            runtime_info.status.should be_nil
          end
        end
      end
    end
  end
end
