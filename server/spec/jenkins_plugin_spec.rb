require 'spec_helper'
require 'json_spec'
require 'open-uri'
require 'stringio'
require 'plugins/build/build_monitor_adapter'
require 'plugins/build/jenkins_plugin'

module Jashboard
  module Plugin
    module CIServer
      describe JenkinsServerConfiguration do
        it("should serialize to a json with type = 'jenkins'") do
          JenkinsServerConfiguration.new("test.host.name", 40, "test-build-id").to_json.
            should be_json_eql %({"type": "jenkins", "hostname": "test.host.name", "port": 40, "build_id": "test-build-id"})
        end
        
      end

      describe JenkinsAdapter do
        it("should register as ci server type handler for type 'jenkins'") do
          BuildMonitorAdapter.class_variable_get('@@ciserver_type_handlers')['jenkins'].should == JenkinsAdapter
        end

        context("Build configuration creation") do
          it("should create an instance of JenkinsServerConfiguration") do
            input_configuration = ({"hostname" => "test.host", "port" => 123, "build_id" => "test-build"})

            configuration = subject.create_configuration(input_configuration)
            configuration.class.should == JenkinsServerConfiguration
            configuration.hostname.should == "test.host"
            configuration.port.should == 123
            configuration.build_id.should == "test-build"
          end
        end

        context("Build runtime info retrieval") do
          before(:each) do
            @uri = double
            @uri.stub(:open) do
              File.new("spec/resources/jenkins-lastbuild-success-response.xml")
            end
            URI.stub(:parse).and_return(@uri)
          end

          it("should invoke the correct url to retrieve last build information") do
            URI.should_receive(:parse).with("http://test.host:1234/job/test.build/lastSuccessfulBuild/api/xml")

            subject.fetch_build_runtime_info(JenkinsServerConfiguration.new("test.host", 1234, "test.build"))
          end
          it("should use parse the xml response to retrieve last build information") do
            runtime_info = subject.fetch_build_runtime_info(JenkinsServerConfiguration.new("test.host", 1234, "test.build"))

            runtime_info.last_build_time.should == "05-11-2012 09:35:08"
            runtime_info.duration.should == 25
            runtime_info.success.should == true
          end
          it("should return current build status as 0 when requesting next build info returns an HTTP 404") do
            next_build_uri = double
            next_build_uri.stub(:open) do
              raise OpenURI::HTTPError.new("404 Not Found", StringIO.new)
            end
            URI.stub(:parse).with("http://test.host:1234/job/test.build/7/api/xml").and_return(next_build_uri)

            runtime_info = subject.fetch_build_runtime_info(JenkinsServerConfiguration.new("test.host", 1234, "test.build"))

            runtime_info.status.should == 0
          end
          it("should return current build status as 1 when requesting next build info returns data") do
            next_build_uri = double
            next_build_uri.stub(:open) do
              StringIO.new "<test></test>"
            end
            URI.stub(:parse).with("http://test.host:1234/job/test.build/7/api/xml").and_return(next_build_uri)

            runtime_info = subject.fetch_build_runtime_info(JenkinsServerConfiguration.new("test.host", 1234, "test.build"))

            runtime_info.status.should == 1
          end
          it("should return current build status as nil when requesting next build info fails") do
            next_build_uri = double
            next_build_uri.stub(:open) do
              raise "Generic Error"
            end
            URI.stub(:parse).with("http://test.host:1234/job/test.build/7/api/xml").and_return(next_build_uri)

            runtime_info = subject.fetch_build_runtime_info(JenkinsServerConfiguration.new("test.host", 1234, "test.build"))

            runtime_info.status.should be_nil
          end
        end
      end
    end
  end
end
