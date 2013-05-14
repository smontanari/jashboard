require 'spec_helper'
require 'open-uri'
require 'stringio'
require 'plugins/build/adapters/go_adapter'

module Jashboard
  module Plugin
    module Build
      describe GoAdapter do
        include Jashboard::RSpecHelper
        before(:each) do
          adapter_class = Class.new do
            include GoAdapter
          end
          @adapter = adapter_class.new
        end

        context("Build runtime info retrieval") do
          before(:each) do
            stub_http_response("http://test.host:1234/go/api/pipelines/test-pipeline/stages.xml") do
              File.new("spec/resources/plugins/build/go-pipeline-feed-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/pipelines/test-pipeline/2.xml") do
              File.new("spec/resources/plugins/build/go-pipeline-detail-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/stages/3.xml") do
              File.new("spec/resources/plugins/build/go-stage1-completed-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/stages/18.xml") do
              File.new("spec/resources/plugins/build/go-stage1-building-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/jobs/3.xml") do
              File.new("spec/resources/plugins/build/go-job1-success-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/jobs/4.xml") do
              File.new("spec/resources/plugins/build/go-job1-building-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/stages/17.xml") do
              File.new("spec/resources/plugins/build/go-stage2-detail-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/stages/4.xml") do
              File.new("spec/resources/plugins/build/go-stage2-detail-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/jobs/5.xml") do
              File.new("spec/resources/plugins/build/go-job2a-success-response.xml")
            end
            stub_http_response("http://test.host:1234/go/api/jobs/6.xml") do
              File.new("spec/resources/plugins/build/go-job2b-failure-response.xml")
            end
            
          end

          it("should return last build information for a successful job") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage2",
              job: "test-job2a"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            runtime_info.last_build_time.should == "2013-05-13 10:49:25 +1000"
            runtime_info.duration.should == 60
            runtime_info.success.should == true
          end
          it("should return last build information for a failed build") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage2",
              job: "test-job2b"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            runtime_info.success.should == false
          end
          it("should return current build status as 0 when job is completed") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage2",
              job: "test-job2a"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            runtime_info.status.should == 0
          end
          it("should return current build status as 1 when job is building") do
            configuration = {
              hostname: "test.host",
              port: 1234,
              type: "go",
              pipeline: "test-pipeline",
              stage: "test-stage1",
              job: "test-job1"
            }.to_struct
            
            runtime_info = @adapter.get_go_runtime_info(configuration)

            runtime_info.status.should == 1
          end
        end
      end
    end
  end
end